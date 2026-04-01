import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";
import { getCache, setCache, getCacheKey } from "@/lib/cache";

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

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    // Check cache first
    const cacheKey = getCacheKey("device-analytics", period);
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log("✅ Returning cached device analytics data");
      return NextResponse.json({
        success: true,
        data: cachedData,
        source: "cache"
      });
    }

    // Convert period to GA4 date range format
    let startDate: string;
    switch (period) {
      case "week":
        startDate = "7daysAgo";
        break;
      case "month":
        startDate = "30daysAgo";
        break;
      case "year":
        startDate = "365daysAgo";
        break;
      default:
        startDate = "today";
    }

    console.log("📱 Fetching Device & Browser Analytics from GA4...");
    console.log("📅 Period:", period, "-> Start Date:", startDate);

    const client = getAnalyticsClient();

    // Helper function to run report with error handling
    async function runReport(config: protos.google.analytics.data.v1beta.IRunReportRequest) {
      try {
        const [response] = await client.runReport(config);
        return response;
      } catch (error: unknown) {
        // Handle INVALID_ARGUMENT error (e.g., no data for today)
        const err = error as { code?: number; message?: string };
        if (err.code === 3 || err.message?.includes("INVALID_ARGUMENT")) {
          console.log("⚠️ No data available for this date range");
          return { rows: [] };
        }
        throw error;
      }
    }

    // Fetch device category data
    const deviceResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch browser data
    const browserResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "browser" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch operating system data
    const osResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "operatingSystem" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch screen resolution data
    const screenResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "screenResolution" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });


    // Process device data
    const devices = deviceResponse.rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process browser data
    const browsers = browserResponse.rows?.map(row => ({
      browser: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process OS data
    const operatingSystems = osResponse.rows?.map(row => ({
      os: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process screen resolution data
    const screenResolutions = screenResponse.rows?.map(row => ({
      resolution: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    const deviceData = {
      devices,
      browsers,
      operatingSystems,
      screenResolutions,
      totalDevices: devices.length,
      totalBrowsers: browsers.length,
      totalOS: operatingSystems.length,
      totalScreenResolutions: screenResolutions.length,
      period
    };

    console.log("✅ Device & Browser Data Received:", {
      devices: devices.length,
      browsers: browsers.length,
      operatingSystems: operatingSystems.length,
      screenResolutions: screenResolutions.length
    });

    // Cache in memory for 5 minutes
    setCache(cacheKey, deviceData, 5);
    console.log("📦 Device analytics data cached in memory");

    return NextResponse.json({
      success: true,
      data: deviceData,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching device analytics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch device analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}