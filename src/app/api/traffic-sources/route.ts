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

    console.log("📊 Fetching Traffic Sources from GA4...");
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

    // Fetch default channel grouping data (Direct, Organic Search, Social, Referral, etc.)
    const channelResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch source/medium data for detailed breakdown
    const sourceResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 15
    });

    // Process channel data
    const channels = channelResponse.rows?.map(row => ({
      channel: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process source data
    const sources = sourceResponse.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      medium: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Map channel groups to user-friendly names
    const channelMapping: { [key: string]: string } = {
      "Direct": "Direct Traffic",
      "Organic Search": "Organic Search",
      "Social": "Social Media",
      "Referral": "Referral Sites",
      "Email": "Email",
      "Paid Search": "Paid Search",
      "Display": "Display Ads",
      "Paid Social": "Paid Social",
      "Unassigned": "Other"
    };

    // Categorize sources for detailed view
    const directTraffic = sources.filter(s => s.medium === "(none)" || s.source === "(direct)");
    const organicSearch = sources.filter(s => s.medium === "organic");
    const socialMedia = sources.filter(s => 
      ["facebook", "instagram", "whatsapp", "twitter", "linkedin", "youtube", "pinterest", "tiktok"].some(
        social => s.source.toLowerCase().includes(social)
      )
    );
    const referralSites = sources.filter(s => s.medium === "referral" && !s.source.toLowerCase().includes("google"));
    const googleMyBusiness = sources.filter(s => 
      s.source.toLowerCase().includes("google") && s.medium === "organic"
    );

    const trafficSources = {
      channels: channels.map(c => ({
        ...c,
        channel: channelMapping[c.channel] || c.channel
      })),
      sources,
      directTraffic,
      organicSearch,
      socialMedia,
      referralSites,
      googleMyBusiness,
      totalChannels: channels.length,
      totalSources: sources.length,
      period
    };

    console.log("✅ Traffic Sources Data Received:", {
      channels: channels.length,
      sources: sources.length,
      directTraffic: directTraffic.length,
      organicSearch: organicSearch.length,
      socialMedia: socialMedia.length,
      referralSites: referralSites.length,
      googleMyBusiness: googleMyBusiness.length
    });

    return NextResponse.json({
      success: true,
      data: trafficSources,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching traffic sources:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch traffic sources",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}