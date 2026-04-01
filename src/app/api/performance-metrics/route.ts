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

    console.log("⚡ Fetching Performance Metrics from GA4...");
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

    // Fetch page load time data
    const pageLoadResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "pageLoadTime" },
        { name: "screenPageViews" }
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10
    });

    // Fetch server response time (TTFB)
    const serverResponseResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "serverResponseTime" },
        { name: "screenPageViews" }
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10
    });

    // Fetch error pages (404s)
    const errorResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "eventName" }],
      metrics: [
        { name: "eventCount" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            matchType: "EXACT",
            value: "page_not_found"
          }
        }
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 10
    });

    // Fetch mobile vs desktop performance
    const devicePerformanceResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [
        { name: "pageLoadTime" },
        { name: "activeUsers" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Process page load data
    const pageLoadData = pageLoadResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      loadTime: parseFloat(row.metricValues?.[0]?.value || "0"),
      views: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process server response data
    const serverResponseData = serverResponseResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      responseTime: parseFloat(row.metricValues?.[0]?.value || "0"),
      views: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process error data
    const errorData = errorResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      event: row.dimensionValues?.[1]?.value || "page_not_found",
      count: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    // Process device performance data
    const devicePerformance = devicePerformanceResponse.rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || "Unknown",
      loadTime: parseFloat(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Calculate averages
    const avgPageLoadTime = pageLoadData.length > 0 
      ? (pageLoadData.reduce((sum, item) => sum + item.loadTime, 0) / pageLoadData.length).toFixed(2)
      : "0";
    
    const avgServerResponseTime = serverResponseData.length > 0
      ? (serverResponseData.reduce((sum, item) => sum + item.responseTime, 0) / serverResponseData.length).toFixed(2)
      : "0";

    const totalErrors = errorData.reduce((sum, item) => sum + item.count, 0);

    const performanceData = {
      pageLoadData,
      serverResponseData,
      errorData,
      devicePerformance,
      avgPageLoadTime,
      avgServerResponseTime,
      totalErrors,
      totalPageLoads: pageLoadData.reduce((sum, item) => sum + item.views, 0),
      totalServerResponses: serverResponseData.reduce((sum, item) => sum + item.views, 0),
      period,
      note: "Core Web Vitals (LCP, FID, CLS) require Chrome UX Report integration"
    };

    console.log("✅ Performance Data Received:", {
      pageLoads: pageLoadData.length,
      serverResponses: serverResponseData.length,
      errors: errorData.length,
      devicePerformance: devicePerformance.length
    });

    return NextResponse.json({
      success: true,
      data: performanceData,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching performance metrics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch performance metrics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}