import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";

// GA4 Property ID
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "459511871";

// Initialize the Analytics Data client
function getAnalyticsClient() {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      return new BetaAnalyticsDataClient({ credentials });
    } catch (error) {
      console.error("Failed to parse Google credentials:", error);
      throw new Error("Invalid Google Analytics credentials format");
    }
  }
  
  return new BetaAnalyticsDataClient();
}

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ClientAdmin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    console.log("⚡ Fetching Real-Time Analytics from GA4...");

    const client = getAnalyticsClient();

    // Helper function to run realtime report with error handling
    async function runRealtimeReport(config: protos.google.analytics.data.v1beta.IRunRealtimeReportRequest) {
      try {
        const [response] = await client.runRealtimeReport(config);
        return response;
      } catch (error: unknown) {
        console.error("Error running realtime report:", error);
        // Handle INVALID_ARGUMENT error specifically
        const err = error as { code?: number; message?: string };
        if (err.code === 3 || err.message?.includes("INVALID_ARGUMENT")) {
          console.log("⚠️ Realtime API INVALID_ARGUMENT - GA4 Realtime may not be enabled for this property");
          return { rows: [] };
        }
        // Return empty response if realtime data not available
        return { rows: [] };
      }
    }

    // Fetch active users now
    const activeUsersResponse = await runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      dimensions: [],
      metrics: [{ name: "activeUsers" }],
      minuteRanges: [{ startMinutesAgo: 5, endMinutesAgo: 0 }],
    });

    // Fetch active pages being viewed right now
    const activePagesResponse = await runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "activeUsers" }],
      minuteRanges: [{ startMinutesAgo: 5, endMinutesAgo: 0 }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    });

    // Fetch real-time location data
    const locationResponse = await runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      dimensions: [{ name: "country" }, { name: "city" }],
      metrics: [{ name: "activeUsers" }],
      minuteRanges: [{ startMinutesAgo: 5, endMinutesAgo: 0 }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    });

    // Fetch real-time device data
    const deviceResponse = await runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
      minuteRanges: [{ startMinutesAgo: 5, endMinutesAgo: 0 }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    });

    // Process active users
    const activeUsers = activeUsersResponse.rows?.[0]?.metricValues?.[0]?.value 
      ? parseInt(activeUsersResponse.rows[0].metricValues[0].value) 
      : 0;

    // Process active pages
    const activePages = activePagesResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      title: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    // Process location data
    const locations = locationResponse.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || "Unknown",
      city: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    // Process device data
    const devices = deviceResponse.rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    const realtimeData = {
      activeUsers,
      activePages,
      locations,
      devices,
      lastUpdated: new Date().toISOString()
    };

    console.log("✅ Real-Time Data Received:", {
      activeUsers,
      activePages: activePages.length,
      locations: locations.length,
      devices: devices.length
    });

    return NextResponse.json({
      success: true,
      data: realtimeData,
      source: "google_analytics_realtime"
    });

  } catch (error) {
    console.error("❌ Error fetching realtime analytics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch realtime analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}