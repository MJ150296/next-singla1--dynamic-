import { BetaAnalyticsDataClient } from "@google-analytics/data";

// GA4 Property ID from environment or hardcoded
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "459511871";

// Initialize the Analytics Data client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (!analyticsDataClient) {
    // Check if credentials are provided via environment variable
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    
    if (credentialsJson) {
      try {
        const credentials = JSON.parse(credentialsJson);
        analyticsDataClient = new BetaAnalyticsDataClient({
          credentials,
        });
      } catch (error) {
        console.error("Failed to parse Google credentials:", error);
        throw new Error("Invalid Google Analytics credentials format");
      }
    } else {
      // Fall back to default credentials (GOOGLE_APPLICATION_CREDENTIALS env var)
      analyticsDataClient = new BetaAnalyticsDataClient();
    }
  }
  
  return analyticsDataClient;
}

export interface GAMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  date: Date;
}

export async function fetchGA4Metrics(
  startDate: string = "7daysAgo",
  endDate: string = "today"
): Promise<GAMetrics> {
  const client = getAnalyticsClient();

  try {
    // Run report for traffic metrics
    const [response] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: "screenPageViews" },           // Total page views
        { name: "activeUsers" },               // Unique visitors
        { name: "sessions" },                  // Sessions
        { name: "bounceRate" },                // Bounce rate
        { name: "averageSessionDuration" },    // Avg session duration
        { name: "sessionsPerUser" },           // Sessions per user (we'll use this for pages per session)
      ],
    });

    // Extract metrics from response
    const metrics = response.rows?.[0]?.metricValues || [];
    
    const totalPageViews = parseInt(metrics[0]?.value || "0", 10);
    const uniqueVisitors = parseInt(metrics[1]?.value || "0", 10);
    const sessions = parseInt(metrics[2]?.value || "0", 10);
    const bounceRate = parseFloat(metrics[3]?.value || "0") * 100; // Convert to percentage
    const avgSessionDuration = Math.round(parseFloat(metrics[4]?.value || "0"));
    const pagesPerSession = parseFloat(metrics[5]?.value || "0");

    return {
      totalPageViews,
      uniqueVisitors,
      sessions,
      bounceRate: Math.round(bounceRate * 10) / 10, // Round to 1 decimal
      avgSessionDuration,
      pagesPerSession: Math.round(pagesPerSession * 10) / 10,
      date: new Date(),
    };
  } catch (error) {
    console.error("Error fetching GA4 metrics:", error);
    throw error;
  }
}

export async function fetchGA4MetricsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<GAMetrics> {
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return fetchGA4Metrics(formatDate(startDate), formatDate(endDate));
}

// Check if GA4 is configured
export function isGA4Configured(): boolean {
  return !!(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}