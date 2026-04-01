import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

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

    console.log("📄 Fetching Page Analytics from GA4...");
    console.log("📅 Period:", period, "-> Start Date:", startDate);

    const client = getAnalyticsClient();

    // Helper function to run report with error handling
    async function runReport(config: any) {
      try {
        const [response] = await client.runReport(config);
        return response;
      } catch (error: any) {
        // Handle INVALID_ARGUMENT error (e.g., no data for today)
        if (error.code === 3 || error.message?.includes("INVALID_ARGUMENT")) {
          console.log("⚠️ No data available for this date range");
          return { rows: [] };
        }
        throw error;
      }
    }

    // Fetch most visited pages (by page views)
    const mostVisitedResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" }
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10
    });

    // Fetch least visited pages (by page views)
    const leastVisitedResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" }
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: false }],
      limit: 10
    });

    // Fetch landing pages
    const landingPagesResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "landingPage" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" }
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10
    });

    // Fetch exit pages
    const exitPagesResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" }
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10
    });

    // Process most visited pages
    const mostVisitedPages = mostVisitedResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      title: row.dimensionValues?.[1]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process least visited pages
    const leastVisitedPages = leastVisitedResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      title: row.dimensionValues?.[1]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0")
    })).filter(page => page.views > 0) || [];

    // Process landing pages
    const landingPages = landingPagesResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process exit pages
    const exitPages = exitPagesResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    const pageAnalytics = {
      mostVisitedPages,
      leastVisitedPages,
      landingPages,
      exitPages,
      totalMostVisited: mostVisitedPages.length,
      totalLeastVisited: leastVisitedPages.length,
      totalLandingPages: landingPages.length,
      totalExitPages: exitPages.length,
      period
    };

    console.log("✅ Page Analytics Data Received:", {
      mostVisitedPages: mostVisitedPages.length,
      leastVisitedPages: leastVisitedPages.length,
      landingPages: landingPages.length,
      exitPages: exitPages.length
    });

    return NextResponse.json({
      success: true,
      data: pageAnalytics,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching page analytics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch page analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}