"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Globe, FileText, TrendingUp, RefreshCw, Users, Info, Database, MousePointerClick, Eye, Target, Award } from "lucide-react";
import "@/app/enterprise-theme.css";

interface KeywordData {
  source: string;
  medium: string;
  users: number;
  sessions: number;
}

interface LandingPageData {
  page: string;
  users: number;
  sessions: number;
}

interface CountryData {
  country: string;
  users: number;
  sessions: number;
}

interface IndexedPageData {
  path: string;
  users: number;
  views: number;
}

interface SearchData {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
}

interface SEOData {
  keywords: KeywordData[];
  landingPages: LandingPageData[];
  countries: CountryData[];
  indexedPages: IndexedPageData[];
  searchData: SearchData | null;
  totalKeywords: number;
  totalLandingPages: number;
  totalCountries: number;
  totalIndexedPages: number;
  period: string;
  note: string | null;
}

export default function SEOAnalyticsClient() {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSEOData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/seo-analytics?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch SEO analytics");
      }

      if (result.success) {
        console.log("🔍 SEO Data Response:", result.data);
        setSeoData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching SEO analytics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSEOData();
  }, [fetchSEOData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSEOData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchSEOData]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="enterprise-brand-icon h-10 w-10">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                SEO & Search Analytics
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor your search engine optimization performance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-[var(--enterprise-border)] rounded-lg bg-[var(--enterprise-surface)] text-[var(--enterprise-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--enterprise-primary)]"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={fetchSEOData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--enterprise-primary)] text-white rounded-lg hover:bg-[var(--enterprise-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-[var(--enterprise-text-muted)] mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Info Banner */}
      {seoData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Google Search Console Integration</p>
              <p className="text-sm text-blue-600 mt-1">{seoData.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Error loading SEO analytics</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Console Overview */}
      {seoData?.searchData && (
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Google Search Console Overview
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Your website&#39;s search performance
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <MousePointerClick className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {seoData.searchData.totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Total Clicks</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {seoData.searchData.totalImpressions.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Impressions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10">
              <Target className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {(seoData.searchData.avgCtr * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Avg CTR</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {seoData.searchData.avgPosition.toFixed(1)}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Avg Position</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Search Keywords */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Top Search Keywords
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Keywords bringing traffic
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Source
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Sessions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : seoData?.keywords.length ? (
                seoData.keywords.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Search className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <span className="font-medium text-[var(--enterprise-text-primary)]">
                            {item.source}
                          </span>
                          <p className="text-xs text-[var(--enterprise-text-muted)] mt-0.5">
                            {item.medium}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.sessions.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No keyword data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Landing Pages */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Landing Pages
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Pages receiving organic search traffic
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Page
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Sessions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : seoData?.landingPages.length ? (
                seoData.landingPages.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                          {item.page}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.sessions.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No landing page data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organic Search by Country */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Organic Search by Country
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Geographic distribution of search traffic
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Country
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Sessions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : seoData?.countries.length ? (
                seoData.countries.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)]">
                          {item.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.sessions.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No country data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Indexed Pages */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Indexed Pages
              </h2>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Pages in Google's index
            </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Page
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : seoData?.indexedPages.length ? (
                seoData.indexedPages.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Database className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                          {item.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.views.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No indexed pages data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About SEO & Search Analytics
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              This data shows how users find your website through organic search. For full SEO metrics including search impressions, click-through rate, and average position, you need to link Google Search Console to your GA4 property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}