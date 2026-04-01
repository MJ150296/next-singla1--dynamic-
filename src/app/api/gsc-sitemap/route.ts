import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { GoogleAuth } from "google-auth-library";

// Google Search Console API
const GSC_PROPERTY_URL = process.env.GSC_PROPERTY_URL || "https://www.singlaromart.in";

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

    console.log("🔍 Fetching Google Search Console Sitemap data...");
    console.log("🌐 Property:", GSC_PROPERTY_URL);

    // Check if GSC credentials are available
    const gscCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (!gscCredentials) {
      console.log("⚠️ GSC credentials not configured, returning mock data");
      
      // Return mock data when GSC is not configured
      return NextResponse.json({
        success: true,
        data: {
          sitemaps: [
            {
              path: "/sitemap.xml",
              lastSubmitted: "2024-01-10",
              isPending: false,
              isSitemapsIndex: false,
              type: "web",
              lastDownloaded: "2024-01-15",
              warnings: 0,
              errors: 0,
              urls: 17,
            },
          ],
          sitemapStats: {
            totalSitemaps: 1,
            submittedUrls: 17,
            indexedUrls: 142,
            pendingUrls: 0,
            errorUrls: 0,
          },
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
      
      // Use Google Search Console API for sitemaps
      const response = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY_URL)}/sitemaps`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
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
              sitemaps: [
                {
                  path: "/sitemap.xml",
                  lastSubmitted: "2024-01-10",
                  isPending: false,
                  isSitemapsIndex: false,
                  type: "web",
                  lastDownloaded: "2024-01-15",
                  warnings: 0,
                  errors: 0,
                  urls: 17,
                },
              ],
              sitemapStats: {
                totalSitemaps: 1,
                submittedUrls: 17,
                indexedUrls: 142,
                pendingUrls: 0,
                errorUrls: 0,
              },
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

      const data = await response.json();

      return NextResponse.json({
        success: true,
        data: {
          sitemaps: data.sitemap || [],
          sitemapStats: {
            totalSitemaps: data.sitemap?.length || 0,
            submittedUrls: 0,
            indexedUrls: 0,
            pendingUrls: 0,
            errorUrls: 0,
          },
        },
        source: "google_search_console",
      });
    } catch (apiError) {
      console.error("GSC API call failed:", apiError);
      
      // Return mock data with error information for better UX
      return NextResponse.json({
        success: true,
        data: {
          sitemaps: [
            {
              path: "/sitemap.xml",
              lastSubmitted: "2024-01-10",
              isPending: false,
              isSitemapsIndex: false,
              type: "web",
              lastDownloaded: "2024-01-15",
              warnings: 0,
              errors: 0,
              urls: 17,
            },
          ],
          sitemapStats: {
            totalSitemaps: 1,
            submittedUrls: 17,
            indexedUrls: 142,
            pendingUrls: 0,
            errorUrls: 0,
          },
          note: "⚠️ Using mock data due to API error. Check console for details.",
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        },
        source: "mock_data_error_fallback",
      });
    }

  } catch (error) {
    console.error("❌ Error fetching GSC sitemap:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch Google Search Console sitemap data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}