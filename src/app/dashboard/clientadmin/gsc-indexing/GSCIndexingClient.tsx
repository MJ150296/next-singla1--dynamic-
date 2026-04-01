"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw, Globe, Clock, Info } from "lucide-react";
import "@/app/enterprise-theme.css";

interface IndexingStatus {
  totalPages: number;
  indexedPages: number;
  notIndexedPages: number;
  indexedPercentage: number;
}

interface IndexCoverage {
  status: string;
  count: number;
  percentage: number;
}

interface RecentIndexing {
  url: string;
  lastCrawled: string;
  status: string;
}

interface Issue {
  type: string;
  message: string;
  count: number;
}

interface IndexingData {
  indexingStatus: IndexingStatus;
  indexCoverage: IndexCoverage[];
  recentIndexing: RecentIndexing[];
  issues: Issue[];
  note: string | null;
}

export default function GSCIndexingClient() {
  const [indexingData, setIndexingData] = useState<IndexingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchIndexingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/gsc-indexing?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch indexing data");
      }

      if (result.success) {
        console.log("📊 Indexing Data Response:", result.data);
        setIndexingData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching indexing data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchIndexingData();
  }, [fetchIndexingData, period]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchIndexingData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchIndexingData]);

  const getStatusIcon = (status: string) => {
    if (status.includes("indexed")) return CheckCircle;
    if (status.includes("not indexed") || status.includes("Excluded")) return XCircle;
    return AlertTriangle;
  };

  const getStatusColor = (status: string) => {
    if (status.includes("indexed")) return "text-green-500";
    if (status.includes("not indexed") || status.includes("Excluded")) return "text-red-500";
    return "text-orange-500";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "Error":
        return XCircle;
      case "Warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case "Error":
        return "text-red-500 bg-red-500/10";
      case "Warning":
        return "text-orange-500 bg-orange-500/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
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
                  Index Coverage
                </h1>
                <p className="enterprise-subtitle mt-1">
                  Monitor how Google indexes your website pages.
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
                onClick={fetchIndexingData}
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
      {indexingData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Google Search Console</p>
              <p className="text-sm text-blue-600 mt-1">{indexingData.note}</p>
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
              <p className="text-sm font-medium text-red-800">Error loading indexing data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Indexing Overview */}
      {indexingData?.indexingStatus && (
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Indexing Overview
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  How many pages are in Google&#39;s index
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <Globe className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {indexingData.indexingStatus.totalPages.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Total Pages</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {indexingData.indexingStatus.indexedPages.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Indexed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {indexingData.indexingStatus.notIndexedPages.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Not Indexed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <AlertTriangle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {indexingData.indexingStatus.indexedPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Coverage</p>
            </div>
          </div>
        </div>
      )}

      {/* Index Coverage Breakdown */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Index Coverage Breakdown
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Status of pages in Google&#39;s index
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Pages
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : indexingData?.indexCoverage.length ? (
                indexingData.indexCoverage.map((item, index) => {
                  const StatusIcon = getStatusIcon(item.status);
                  return (
                    <tr
                      key={index}
                      className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-lg bg-opacity-10 flex items-center justify-center ${getStatusColor(item.status).replace('text-', 'bg-').replace('-500', '-500/10')}`}>
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                          </div>
                          <span className="font-medium text-[var(--enterprise-text-primary)]">
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.count.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No coverage data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Indexing */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Recently Indexed Pages
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Pages recently crawled by Google
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Last Crawled
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : indexingData?.recentIndexing.length ? (
                indexingData.recentIndexing.map((item, index) => {
                  const StatusIcon = getStatusIcon(item.status);
                  return (
                    <tr
                      key={index}
                      className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                            {item.url}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[var(--enterprise-text-primary)]">
                          {item.lastCrawled}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                          <span className={`font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No recent indexing data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Indexing Issues
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Problems detected with your pages
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-[var(--enterprise-border-light)]">
                <div className="h-10 w-10 bg-[var(--enterprise-surface-elevated)] rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div>
                  <div className="h-4 w-64 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : indexingData?.issues.length ? (
            indexingData.issues.map((issue, index) => {
              const IssueIcon = getIssueIcon(issue.type);
              const colorClass = getIssueColor(issue.type);
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-[var(--enterprise-border-light)] hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass.split(' ')[1]}`}>
                    <IssueIcon className={`h-5 w-5 ${colorClass.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${colorClass}`}>
                        {issue.type}
                      </span>
                      <span className="text-xs text-[var(--enterprise-text-muted)]">
                        {issue.count} {issue.count === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--enterprise-text-primary)]">
                      {issue.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-[var(--enterprise-text-muted)]">
              No issues detected
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Index Coverage
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Index Coverage shows which pages from your site are included in Google&#39;s index. A high index coverage percentage means most of your important pages are discoverable in search results. Address any issues to improve your site&#39;s visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}