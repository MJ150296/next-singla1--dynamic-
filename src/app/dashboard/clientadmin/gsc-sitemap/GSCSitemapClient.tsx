"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw, Globe, Clock, Info, Upload } from "lucide-react";
import "@/app/enterprise-theme.css";

interface Sitemap {
  path: string;
  lastSubmitted: string;
  isPending: boolean;
  isSitemapsIndex: boolean;
  type: string;
  lastDownloaded: string;
  warnings: number;
  errors: number;
  urls?: number;
  contents?: Array<{
    type: string;
    submitted: string;
    indexed: string;
  }>;
}

interface SitemapStats {
  totalSitemaps: number;
  submittedUrls: number;
  indexedUrls: number;
  pendingUrls: number;
  errorUrls: number;
}

interface SitemapData {
  sitemaps: Sitemap[];
  sitemapStats: SitemapStats;
  note: string | null;
}

export default function GSCSitemapClient() {
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSitemapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/gsc-sitemap?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch sitemap data");
      }

      if (result.success) {
        console.log("📊 Sitemap Data Response:", result.data);
        setSitemapData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching sitemap data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSitemapData();
  }, [fetchSitemapData, period]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSitemapData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchSitemapData]);

  const getStatusIcon = (sitemap: Sitemap) => {
    if (sitemap.errors > 0) return XCircle;
    if (sitemap.warnings > 0) return AlertTriangle;
    if (sitemap.isPending) return Clock;
    return CheckCircle;
  };

  const getStatusColor = (sitemap: Sitemap) => {
    if (sitemap.errors > 0) return "text-red-500";
    if (sitemap.warnings > 0) return "text-orange-500";
    if (sitemap.isPending) return "text-blue-500";
    return "text-green-500";
  };

  const getStatusText = (sitemap: Sitemap) => {
    if (sitemap.errors > 0) return "Error";
    if (sitemap.warnings > 0) return "Warning";
    if (sitemap.isPending) return "Pending";
    return "Submitted";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="enterprise-brand-icon h-10 w-10">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                  Sitemaps
                </h1>
                <p className="enterprise-subtitle mt-1">
                  Manage and monitor your website sitemaps.
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
                onClick={fetchSitemapData}
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
      {sitemapData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Google Search Console</p>
              <p className="text-sm text-blue-600 mt-1">{sitemapData.note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading sitemap data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Overview */}
      {sitemapData?.sitemapStats && (
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Sitemap Overview
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Summary of submitted sitemaps
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {sitemapData.sitemapStats.totalSitemaps}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Total Sitemaps</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <Globe className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {sitemapData.sitemapStats.submittedUrls.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Submitted URLs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {sitemapData.sitemapStats.indexedUrls.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Indexed URLs</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10">
              <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {sitemapData.sitemapStats.pendingUrls}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Pending</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {sitemapData.sitemapStats.errorUrls}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Errors</p>
            </div>
          </div>
        </div>
      )}

      {/* Sitemaps List */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Submitted Sitemaps
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                All sitemaps submitted to Google
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Sitemap
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  URLs
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Warnings
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Errors
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Last Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : sitemapData?.sitemaps.length ? (
                sitemapData.sitemaps.map((item, index) => {
                  const StatusIcon = getStatusIcon(item);
                  return (
                    <tr
                      key={index}
                      className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                              {item.path}
                            </span>
                            <p className="text-xs text-[var(--enterprise-text-muted)] mt-0.5">
                              {item.type} • {item.isSitemapsIndex ? 'Index' : 'Standard'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.urls !== undefined 
                            ? item.urls.toLocaleString()
                            : item.contents?.reduce((sum, c) => sum + parseInt(c.submitted || '0'), 0).toLocaleString() || '0'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-semibold ${item.warnings > 0 ? 'text-orange-500' : 'text-[var(--enterprise-text-primary)]'}`}>
                          {item.warnings}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-semibold ${item.errors > 0 ? 'text-red-500' : 'text-[var(--enterprise-text-primary)]'}`}>
                          {item.errors}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[var(--enterprise-text-primary)]">
                          {item.lastSubmitted}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(item)}`} />
                          <span className={`font-medium ${getStatusColor(item)}`}>
                            {getStatusText(item)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No sitemaps submitted
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Sitemaps
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Sitemaps help Google discover and index your website pages. Submit your sitemap.xml to ensure all important pages are crawled. Monitor for errors and warnings to maintain a healthy index status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}