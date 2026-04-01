import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
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
    const cacheKey = getCacheKey("geographic-data", period);
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log("✅ Returning cached geographic data");
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

    console.log("🌍 Fetching Geographic Data from GA4...");
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

    // Fetch country data
    const countryResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10
    });

    // Fetch city data
    const cityResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "city" }, { name: "country" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 15
    });

    // Fetch region data (for service area analysis)
    const regionResponse = await runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "region" }, { name: "country" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" }
      ],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 20
    });


    // Process country data
    const countries = countryResponse.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })) || [];

    // Process city data
    const cities = cityResponse.rows?.map(row => ({
      city: row.dimensionValues?.[0]?.value || "Unknown",
      country: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })).filter(city => city.city !== "(not set)") || [];

    // Process region data
    const regions = regionResponse.rows?.map(row => ({
      region: row.dimensionValues?.[0]?.value || "Unknown",
      country: row.dimensionValues?.[1]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0")
    })).filter(region => region.region !== "(not set)") || [];

    // Define service areas (customize based on your business)
    const serviceAreas = ["Delhi", "Noida", "Ghaziabad", "Gurugram", "Faridabad", "Greater Noida"];
    
    // Filter service area traffic
    const serviceAreaTraffic = regions.filter(region => 
      serviceAreas.some(area => 
        region.region.toLowerCase().includes(area.toLowerCase())
      )
    );

    const geographicData = {
      countries,
      cities,
      regions,
      serviceAreaTraffic,
      totalCountries: countries.length,
      totalCities: cities.length,
      period
    };

    console.log("✅ Geographic Data Received:", {
      countries: countries.length,
      cities: cities.length,
      regions: regions.length,
      serviceAreas: serviceAreaTraffic.length
    });

    // Cache in memory for 5 minutes
    setCache(cacheKey, geographicData, 5);
    console.log("📦 Geographic data cached in memory");

    return NextResponse.json({
      success: true,
      data: geographicData,
      source: "google_analytics"
    });

  } catch (error) {
    console.error("❌ Error fetching geographic data:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch geographic data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}