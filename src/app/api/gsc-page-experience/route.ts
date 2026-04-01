import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { GoogleAuth } from "google-auth-library";

// Google Search Console API
const GSC_PROPERTY_URL = process.env.GSC_PROPERTY_URL || "https://www.singlaromart.in";

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

    console.log("🔍 Fetching Google Search Console Page Experience data...");
    console.log("🌐 Property:", GSC_PROPERTY_URL);

    // Check if GSC credentials are available
    const gscCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (!gscCredentials) {
      console.log("⚠️ GSC credentials not configured, returning mock data");
      
      // Return mock data when GSC is not configured
      return NextResponse.json({
        success: true,
        data: {
          coreWebVitals: {
            lcp: {
              value: 2.1,
              unit: "s",
              status: "Good",
              percentile: 75,
            },
            fid: {
              value: 45,
              unit: "ms",
              status: "Good",
              percentile: 75,
            },
            cls: {
              value: 0.08,
              unit: "",
              status: "Good",
              percentile: 75,
            },
          },
          pageExperience: {
            goodUrls: 142,
            needsImprovementUrls: 8,
            poorUrls: 6,
            goodPercentage: 91.03,
          },
          mobileUsability: {
            goodUrls: 148,
            issues: 8,
            goodPercentage: 94.87,
          },
          https: {
            secureUrls: 156,
            insecureUrls: 0,
            securePercentage: 100,
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
      
      // Use Google Search Console API for page experience
      const response = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY_URL)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            dimensions: ["page"],
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
              coreWebVitals: {
                lcp: {
                  value: 2.1,
                  unit: "s",
                  status: "Good",
                  percentile: 75,
                },
                fid: {
                  value: 45,
                  unit: "ms",
                  status: "Good",
                  percentile: 75,
                },
                cls: {
                  value: 0.08,
                  unit: "",
                  status: "Good",
                  percentile: 75,
                },
              },
              pageExperience: {
                goodUrls: 142,
                needsImprovementUrls: 8,
                poorUrls: 6,
                goodPercentage: 91.03,
              },
              mobileUsability: {
                goodUrls: 148,
                issues: 8,
                goodPercentage: 94.87,
              },
              https: {
                secureUrls: 156,
                insecureUrls: 0,
                securePercentage: 100,
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
          coreWebVitals: {
            lcp: { value: 0, unit: "s", status: "Unknown", percentile: 0 },
            fid: { value: 0, unit: "ms", status: "Unknown", percentile: 0 },
            cls: { value: 0, unit: "", status: "Unknown", percentile: 0 },
          },
          pageExperience: {
            goodUrls: 0,
            needsImprovementUrls: 0,
            poorUrls: 0,
            goodPercentage: 0,
          },
          mobileUsability: {
            goodUrls: 0,
            issues: 0,
            goodPercentage: 0,
          },
          https: {
            secureUrls: 0,
            insecureUrls: 0,
            securePercentage: 0,
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
          coreWebVitals: {
            lcp: {
              value: 2.1,
              unit: "s",
              status: "Good",
              percentile: 75,
            },
            fid: {
              value: 45,
              unit: "ms",
              status: "Good",
              percentile: 75,
            },
            cls: {
              value: 0.08,
              unit: "",
              status: "Good",
              percentile: 75,
            },
          },
          pageExperience: {
            goodUrls: 142,
            needsImprovementUrls: 8,
            poorUrls: 6,
            goodPercentage: 91.03,
          },
          mobileUsability: {
            goodUrls: 148,
            issues: 8,
            goodPercentage: 94.87,
          },
          https: {
            secureUrls: 156,
            insecureUrls: 0,
            securePercentage: 100,
          },
          note: "⚠️ Using mock data due to API error. Check console for details.",
          error: apiError instanceof Error ? apiError.message : "Unknown error",
        },
        source: "mock_data_error_fallback",
      });
    }

  } catch (error) {
    console.error("❌ Error fetching GSC page experience:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch Google Search Console page experience data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}