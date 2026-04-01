import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { GoogleAuth } from "google-auth-library";

// Google Search Console API
const GSC_PROPERTY_URL = process.env.GSC_PROPERTY_URL || "https://www.singlaromart.in";

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCResponse {
  rows?: GSCRow[];
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

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "today":
        // Start and end are both today
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to today
        break;
    }

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    console.log("🔍 Fetching Google Search Console data...");
    console.log("📅 Period:", period);
    console.log("🌐 Property:", GSC_PROPERTY_URL);

    // Check if GSC credentials are available
    const gscCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (!gscCredentials) {
      console.log("⚠️ GSC credentials not configured, returning mock data");
      
      // Return mock data when GSC is not configured
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalClicks: 1250,
            totalImpressions: 45000,
            avgCtr: 2.78,
            avgPosition: 12.5,
          },
          topQueries: [
            { query: "ro water purifier", clicks: 150, impressions: 5000, ctr: 3.0, position: 8.2 },
            { query: "water purifier service", clicks: 120, impressions: 4500, ctr: 2.67, position: 10.5 },
            { query: "ro repair near me", clicks: 100, impressions: 3800, ctr: 2.63, position: 11.2 },
            { query: "singla ro mart", clicks: 80, impressions: 2000, ctr: 4.0, position: 1.5 },
            { query: "best ro service gaur city", clicks: 60, impressions: 2500, ctr: 2.4, position: 15.3 },
          ],
          topPages: [
            { page: "/", clicks: 300, impressions: 12000, ctr: 2.5, position: 10.2 },
            { page: "/services", clicks: 200, impressions: 8000, ctr: 2.5, position: 12.5 },
            { page: "/products", clicks: 150, impressions: 6000, ctr: 2.5, position: 14.2 },
            { page: "/contact-us", clicks: 100, impressions: 4000, ctr: 2.5, position: 11.8 },
            { page: "/blogs", clicks: 80, impressions: 3500, ctr: 2.29, position: 16.5 },
          ],
          deviceBreakdown: [
            { device: "MOBILE", clicks: 750, impressions: 28000, ctr: 2.68, position: 13.2 },
            { device: "DESKTOP", clicks: 400, impressions: 14000, ctr: 2.86, position: 11.5 },
            { device: "TABLET", clicks: 100, impressions: 3000, ctr: 3.33, position: 14.8 },
          ],
          countryBreakdown: [
            { country: "IND", clicks: 1100, impressions: 40000, ctr: 2.75, position: 12.2 },
            { country: "USA", clicks: 80, impressions: 3000, ctr: 2.67, position: 15.5 },
            { country: "ARE", clicks: 40, impressions: 1200, ctr: 3.33, position: 18.2 },
          ],
          period: period,
          note: "Mock data - Configure GOOGLE_APPLICATION_CREDENTIALS_JSON for real GSC data",
        },
        source: "mock_data",
      });
    }

    // If GSC credentials are available, make actual API call
    try {
      const credentials = JSON.parse(gscCredentials);
      
      // Create Google Auth client
      const auth = new GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      });
      
      // Get access token
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      
      // Use Google Search Console API
      const response = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY_URL)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            dimensions: ["query", "page", "device", "country"],
            rowLimit: 100,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GSC API error ${response.status}:`, errorText);
        
        // Handle 403 permission error specifically
        if (response.status === 403) {
          console.error("❌ Permission denied. Service account needs access to Google Search Console.");
          console.error("📧 Add this email to GSC: ga4-integration@ga4-integration-491217.iam.gserviceaccount.com");
          
          // Return mock data with helpful error message
          return NextResponse.json({
            success: true,
            data: {
              overview: {
                totalClicks: 1250,
                totalImpressions: 45000,
                avgCtr: 2.78,
                avgPosition: 12.5,
              },
              topQueries: [
                { query: "ro water purifier", clicks: 150, impressions: 5000, ctr: 3.0, position: 8.2 },
                { query: "water purifier service", clicks: 120, impressions: 4500, ctr: 2.67, position: 10.5 },
                { query: "ro repair near me", clicks: 100, impressions: 3800, ctr: 2.63, position: 11.2 },
                { query: "singla ro mart", clicks: 80, impressions: 2000, ctr: 4.0, position: 1.5 },
                { query: "best ro service gaur city", clicks: 60, impressions: 2500, ctr: 2.4, position: 15.3 },
              ],
              topPages: [
                { page: "/", clicks: 300, impressions: 12000, ctr: 2.5, position: 10.2 },
                { page: "/services", clicks: 200, impressions: 8000, ctr: 2.5, position: 12.5 },
                { page: "/products", clicks: 150, impressions: 6000, ctr: 2.5, position: 14.2 },
                { page: "/contact-us", clicks: 100, impressions: 4000, ctr: 2.5, position: 11.8 },
                { page: "/blogs", clicks: 80, impressions: 3500, ctr: 2.29, position: 16.5 },
              ],
              deviceBreakdown: [
                { device: "MOBILE", clicks: 750, impressions: 28000, ctr: 2.68, position: 13.2 },
                { device: "DESKTOP", clicks: 400, impressions: 14000, ctr: 2.86, position: 11.5 },
                { device: "TABLET", clicks: 100, impressions: 3000, ctr: 3.33, position: 14.8 },
              ],
              countryBreakdown: [
                { country: "IND", clicks: 1100, impressions: 40000, ctr: 2.75, position: 12.2 },
                { country: "USA", clicks: 80, impressions: 3000, ctr: 2.67, position: 15.5 },
                { country: "ARE", clicks: 40, impressions: 1200, ctr: 3.33, position: 18.2 },
              ],
              period: period,
              note: "⚠️ Permission denied - Using mock data. See console for setup instructions.",
              error: "GSC_PERMISSION_DENIED",
              setupInstructions: {
                step1: "Go to Google Search Console (https://search.google.com/search-console)",
                step2: "Select your property: https://www.singlaromart.in",
                step3: "Go to Settings → Users and permissions",
                step4: "Add user: ga4-integration@ga4-integration-491217.iam.gserviceaccount.com",
                step5: "Grant 'Restricted' or 'Full' permission",
                step6: "Wait a few minutes and refresh this page",
              },
            },
            source: "mock_data_permission_error",
          });
        }
        
        throw new Error(`GSC API error: ${response.status} - ${errorText}`);
      }

      const data: GSCResponse = await response.json();

      // Process the data
      const topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }> = [];
      const topPages: Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }> = [];
      const deviceBreakdown: Array<{ device: string; clicks: number; impressions: number; ctr: number; position: number }> = [];
      const countryBreakdown: Array<{ country: string; clicks: number; impressions: number; ctr: number; position: number }> = [];

      let totalClicks = 0;
      let totalImpressions = 0;

      if (data.rows) {
        data.rows.forEach((row) => {
          totalClicks += row.clicks;
          totalImpressions += row.impressions;
        });
      }

      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalClicks,
            totalImpressions,
            avgCtr: parseFloat(avgCtr.toFixed(2)),
            avgPosition: 0,
          },
          topQueries,
          topPages,
          deviceBreakdown,
          countryBreakdown,
          period: period,
        },
        source: "google_search_console",
      });
    } catch (apiError) {
      console.error("GSC API call failed:", apiError);
      
      // Return mock data with error information for better UX
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalClicks: 1250,
            totalImpressions: 45000,
            avgCtr: 2.78,
            avgPosition: 12.5,
          },
          topQueries: [
            { query: "ro water purifier", clicks: 150, impressions: 5000, ctr: 3.0, position: 8.2 },
            { query: "water purifier service", clicks: 120, impressions: 4500, ctr: 2.67, position: 10.5 },
            { query: "ro repair near me", clicks: 100, impressions: 3800, ctr: 2.63, position: 11.2 },
            { query: "singla ro mart", clicks: 80, impressions: 2000, ctr: 4.0, position: 1.5 },
            { query: "best ro service gaur city", clicks: 60, impressions: 2500, ctr: 2.4, position: 15.3 },
          ],
          topPages: [
            { page: "/", clicks: 300, impressions: 12000, ctr: 2.5, position: 10.2 },
            { page: "/services", clicks: 200, impressions: 8000, ctr: 2.5, position: 12.5 },
            { page: "/products", clicks: 150, impressions: 6000, ctr: 2.5, position: 14.2 },
            { page: "/contact-us", clicks: 100, impressions: 4000, ctr: 2.5, position: 11.8 },
            { page: "/blogs", clicks: 80, impressions: 3500, ctr: 2.29, position: 16.5 },
          ],
          deviceBreakdown: [
            { device: "MOBILE", clicks: 750, impressions: 28000, ctr: 2.68, position: 13.2 },
            { device: "DESKTOP", clicks: 400, impressions: 14000, ctr: 2.86, position: 11.5 },
            { device: "TABLET", clicks: 100, impressions: 3000, ctr: 3.33, position: 14.8 },
          ],
          countryBreakdown: [
            { country: "IND", clicks: 1100, impressions: 40000, ctr: 2.75, position: 12.2 },
            { country: "USA", clicks: 80, impressions: 3000, ctr: 2.67, position: 15.5 },
            { country: "ARE", clicks: 40, impressions: 1200, ctr: 3.33, position: 18.2 },
          ],
          period: period,
          note: "⚠️ Using mock data due to API error. Check console for details.",
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        },
        source: "mock_data_error_fallback",
      });
    }

  } catch (error) {
    console.error("❌ Error fetching GSC performance:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch Google Search Console performance data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}