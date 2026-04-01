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

    console.log("🔍 Fetching SEO & Search Analytics from GA4...");
    console.log("📅 Period:", period, "-> Start Date:", startDate);

    const client = getAnalyticsClient();

    // Helper function to run report with error handling
    async function runReport(config: protos.google.analytics.data.v1beta.IRunReportRequest) {
      try {
        const [response] = await client.runReport(config);
        return response;
      } catch (error: unknown) {
        // Handle INVALID_ARGUMENT error (e.g., no data for today)
        const err = error as { code?: number; message?: string; details?: unknown };
        if (err.code === 3 || err.message?.includes("INVALID_ARGUMENT")) {
          console.log("⚠️ No data available for this date range");
          return { rows: [] };
        }
        throw error;
      }
    }

    // Fetch search keywords (organic search traffic)
    const keywordsResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionMedium",
          stringFilter: {
            matchType: "EXACT",
            value: "organic"
          }
        }
      },
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch landing pages for search traffic
    const landingPagesResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "landingPage" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionMedium",
          stringFilter: {
            matchType: "EXACT",
            value: "organic"
          }
        }
      },
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch organic search by country
    const countryResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionMedium",
          stringFilter: {
            matchType: "EXACT",
            value: "organic"
          }
        }
      },
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch indexed pages (pages with traffic)
    const indexedPagesResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" }
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20
    });

    // Process keywords data
    const keywords = keywordsResponse.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      medium: row.dimensionValues?.[1]?.value || "organic",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process landing pages data
    const landingPages = landingPagesResponse.rows?.map(row => ({
      page: row.dimensionValues?.[0]?.value || "/",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process country data
    const countries = countryResponse.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process indexed pages data
    const indexedPages = indexedPagesResponse.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || "/",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      views: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    const seoData = {
      keywords,
      landingPages,
      countries,
      indexedPages,
      totalKeywords: keywords.length,
      totalLandingPages: landingPages.length,
      totalCountries: countries.length,
      totalIndexedPages: indexedPages.length,
      period,
      note: "Google Search Console integration required for full SEO data (impressions, CTR, position)"
    };

    console.log("✅ SEO Data Received:", {
      keywords: keywords.length,
      landingPages: landingPages.length,
      countries: countries.length
    });

    return NextResponse.json({
      success: true,
      data: seoData,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching SEO analytics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch SEO analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}