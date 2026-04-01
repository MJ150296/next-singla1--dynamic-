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

    console.log("📊 Fetching User Behavior Analytics from GA4...");
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

    // Fetch scroll depth events
    const scrollResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [
        { name: "eventCount" },
        { name: "eventCountPerUser" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            matchType: "EXACT",
            value: "scroll"
          }
        }
      },
      limit: 10
    });

    // Fetch click events
    const clickResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "eventName" }, { name: "linkUrl" }],
      metrics: [
        { name: "eventCount" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            matchType: "EXACT",
            value: "click"
          }
        }
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 10
    });

    // Fetch form interaction events
    const formResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [
        { name: "eventCount" },
        { name: "eventCountPerUser" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: {
            values: ["form_start", "form_submit"]
          }
        }
      },
      limit: 10
    });

    // Fetch phone click events (tel: links)
    const phoneResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "linkUrl" }],
      metrics: [
        { name: "eventCount" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "linkUrl",
          stringFilter: {
            matchType: "CONTAINS",
            value: "tel:"
          }
        }
      },
      limit: 10
    });

    // Fetch WhatsApp click events
    const whatsappResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "linkUrl" }],
      metrics: [
        { name: "eventCount" }
      ],
      dimensionFilter: {
        filter: {
          fieldName: "linkUrl",
          stringFilter: {
            matchType: "CONTAINS",
            value: "wa.me"
          }
        }
      },
      limit: 10
    });

    // Process scroll data
    const scrollData = scrollResponse.rows?.map(row => ({
      event: row.dimensionValues?.[0]?.value || "scroll",
      count: parseInt(row.metricValues?.[0]?.value || "0"),
      perUser: parseFloat(row.metricValues?.[1]?.value || "0").toFixed(2)
    })) || [];

    // Process click data
    const clickData = clickResponse.rows?.map(row => ({
      event: row.dimensionValues?.[0]?.value || "click",
      link: row.dimensionValues?.[1]?.value || "Unknown",
      count: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    // Process form data
    const formData = formResponse.rows?.map(row => ({
      event: row.dimensionValues?.[0]?.value || "form",
      count: parseInt(row.metricValues?.[0]?.value || "0"),
      perUser: parseFloat(row.metricValues?.[1]?.value || "0").toFixed(2)
    })) || [];

    // Process phone data
    const phoneData = phoneResponse.rows?.map(row => ({
      link: row.dimensionValues?.[0]?.value || "tel:",
      count: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    // Process WhatsApp data
    const whatsappData = whatsappResponse.rows?.map(row => ({
      link: row.dimensionValues?.[0]?.value || "wa.me",
      count: parseInt(row.metricValues?.[0]?.value || "0")
    })) || [];

    const userBehaviorData = {
      scrollData,
      clickData,
      formData,
      phoneData,
      whatsappData,
      totalScrollEvents: scrollData.reduce((sum, item) => sum + item.count, 0),
      totalClickEvents: clickData.reduce((sum, item) => sum + item.count, 0),
      totalFormEvents: formData.reduce((sum, item) => sum + item.count, 0),
      totalPhoneClicks: phoneData.reduce((sum, item) => sum + item.count, 0),
      totalWhatsAppClicks: whatsappData.reduce((sum, item) => sum + item.count, 0),
      period
    };

    console.log("✅ User Behavior Data Received:", {
      scrollEvents: scrollData.length,
      clickEvents: clickData.length,
      formEvents: formData.length,
      phoneClicks: phoneData.length,
      whatsappClicks: whatsappData.length
    });

    return NextResponse.json({
      success: true,
      data: userBehaviorData,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching user behavior analytics:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch user behavior analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}