import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import dbConnect from "@/utils/dbConnect";
import TrafficMetrics from "@/model/TrafficMetrics.model";
import { fetchGA4Metrics, isGA4Configured } from "@/lib/googleAnalytics";
import { getCache, setCache, getCacheKey } from "@/lib/cache";

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

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today"; // today, week, month, year

    let startDate: Date;
    const endDate = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (period) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = today;
    }

    // Check cache first
    const cacheKey = getCacheKey("traffic-metrics", period);
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log("✅ Returning cached traffic metrics data");
      return NextResponse.json({
        success: true,
        data: cachedData,
        period,
        source: "cache"
      });
    }

    // Check if Google Analytics is configured
    console.log("🔍 Checking GA4 Configuration...");
    console.log("GA4 Configured:", isGA4Configured());

    if (isGA4Configured()) {
      try {
        console.log("📊 Attempting to fetch from Google Analytics...");
        // Fetch data from Google Analytics
        let gaStartDate: string;
        let gaEndDate: string;

        switch (period) {
          case "week":
            gaStartDate = "7daysAgo";
            gaEndDate = "today";
            break;
          case "month":
            gaStartDate = "30daysAgo";
            gaEndDate = "today";
            break;
          case "year":
            gaStartDate = "365daysAgo";
            gaEndDate = "today";
            break;
          default:
            gaStartDate = "today";
            gaEndDate = "today";
        }

        console.log(`📅 Date Range: ${gaStartDate} to ${gaEndDate}`);
        const gaMetrics = await fetchGA4Metrics(gaStartDate, gaEndDate);
        console.log("✅ GA4 Data Received:", JSON.stringify(gaMetrics, null, 2));

        // Save to database for caching
        await TrafficMetrics.create({
          userId: session.user.id,
          ...gaMetrics,
        });
        console.log("💾 Data saved to MongoDB cache");
        
        // Cache in memory for 5 minutes
        setCache(cacheKey, gaMetrics, 5);
        console.log("📦 Data cached in memory");

        return NextResponse.json({
          success: true,
          data: gaMetrics,
          period,
          source: "google_analytics",
        });
      } catch (gaError) {
        console.error("❌ Error fetching from GA4, falling back to database:", gaError);
        // Fall through to database lookup
      }
    } else {
      console.log("⚠️ GA4 not configured, using database fallback");
    }

    // Fallback: Get the latest metrics from database
    console.log("💾 Querying MongoDB for cached data...");
    const metrics = await TrafficMetrics.findOne({
      userId: session.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    // If no data exists, generate sample data for demonstration
    if (!metrics) {
      console.log("🎲 No data found, generating sample data...");
      const sampleMetrics = {
        userId: session.user.id,
        totalPageViews: Math.floor(Math.random() * 10000) + 1000,
        uniqueVisitors: Math.floor(Math.random() * 5000) + 500,
        sessions: Math.floor(Math.random() * 3000) + 300,
        bounceRate: Math.floor(Math.random() * 40) + 30,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60,
        pagesPerSession: parseFloat((Math.random() * 3 + 2).toFixed(1)),
        date: new Date(),
      };

      console.log("📊 Sample Data Generated:", JSON.stringify(sampleMetrics, null, 2));

      // Save the sample data for future reference
      await TrafficMetrics.create(sampleMetrics);
      console.log("💾 Sample data saved to MongoDB");

      return NextResponse.json({
        success: true,
        data: sampleMetrics,
        period,
        source: "sample_data",
      });
    }

    console.log("✅ Data found in MongoDB:", JSON.stringify({
      totalPageViews: metrics.totalPageViews,
      uniqueVisitors: metrics.uniqueVisitors,
      sessions: metrics.sessions,
      bounceRate: metrics.bounceRate,
      avgSessionDuration: metrics.avgSessionDuration,
      pagesPerSession: metrics.pagesPerSession,
      date: metrics.date,
    }, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        totalPageViews: metrics.totalPageViews,
        uniqueVisitors: metrics.uniqueVisitors,
        sessions: metrics.sessions,
        bounceRate: metrics.bounceRate,
        avgSessionDuration: metrics.avgSessionDuration,
        pagesPerSession: metrics.pagesPerSession,
        date: metrics.date,
      },
      period,
      source: "database",
    });
  } catch (error) {
    console.error("Error fetching traffic metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    await dbConnect();

    const body = await request.json();
    const {
      totalPageViews,
      uniqueVisitors,
      sessions,
      bounceRate,
      avgSessionDuration,
      pagesPerSession,
    } = body;

    const metrics = await TrafficMetrics.create({
      userId: session.user.id,
      totalPageViews: totalPageViews || 0,
      uniqueVisitors: uniqueVisitors || 0,
      sessions: sessions || 0,
      bounceRate: bounceRate || 0,
      avgSessionDuration: avgSessionDuration || 0,
      pagesPerSession: pagesPerSession || 0,
      date: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error creating traffic metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}