"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, Clock, Server, Smartphone, AlertTriangle, RefreshCw, Users, Info } from "lucide-react";
import "@/app/enterprise-theme.css";

interface PageLoadData {
  path: string;
  loadTime: number;
  views: number;
}

interface ServerResponseData {
  path: string;
  responseTime: number;
  views: number;
}

interface ErrorData {
  path: string;
  event: string;
  count: number;
}

interface DevicePerformanceData {
  device: string;
  loadTime: number;
  users: number;
}

interface PerformanceData {
  pageLoadData: PageLoadData[];
  serverResponseData: ServerResponseData[];
  errorData: ErrorData[];
  devicePerformance: DevicePerformanceData[];
  avgPageLoadTime: string;
  avgServerResponseTime: string;
  totalErrors: number;
  totalPageLoads: number;
  totalServerResponses: number;
  period: string;
  note: string;
}

export default function PerformanceMetricsClient() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPerformanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/performance-metrics?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch performance metrics");
      }

      if (result.success) {
        console.log("⚡ Performance Data Response:", result.data);
        setPerformanceData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching performance metrics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPerformanceData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchPerformanceData]);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return <Server className="h-4 w-4 text-blue-500" />;
      case "mobile":
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case "tablet":
        return <Smartphone className="h-4 w-4 text-purple-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIconBg = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return "bg-blue-500/10";
      case "mobile":
        return "bg-green-500/10";
      case "tablet":
        return "bg-purple-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="enterprise-brand-icon h-10 w-10">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                Performance Metrics
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor website performance and user experience.
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
              onClick={fetchPerformanceData}
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
      {performanceData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Core Web Vitals</p>
              <p className="text-sm text-blue-600 mt-1">{performanceData.note}</p>
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
              <p className="text-sm font-medium text-red-800">Error loading performance metrics</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Load Time */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Page Load Time
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Average load speed
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
                  Load Time (s)
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
              ) : performanceData?.pageLoadData.length ? (
                performanceData.pageLoadData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                          {item.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.loadTime.toFixed(2)}s
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
                    No page load data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Server Response Time (TTFB) */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Server className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Server Response Time
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                TTFB (Time to First Byte)
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
                  Response Time (s)
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
              ) : performanceData?.serverResponseData.length ? (
                performanceData.serverResponseData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Server className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                          {item.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.responseTime.toFixed(2)}s
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
                    No server response data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Performance */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Mobile Performance
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Mobile-specific metrics
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Device
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Load Time (s)
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : performanceData?.devicePerformance.length ? (
                performanceData.devicePerformance.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg ${getDeviceIconBg(item.device)} flex items-center justify-center`}>
                          {getDeviceIcon(item.device)}
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] capitalize">
                          {item.device}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.loadTime.toFixed(2)}s
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No device performance data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Rate */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Error Rate
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                404s and other errors
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
                  Error Count
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : performanceData?.errorData.length ? (
                performanceData.errorData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)] text-sm">
                          {item.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.count.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No error data available
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
              About Performance Metrics
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              This data shows your website&#39;s performance metrics including page load times, server response times, and error rates. Use this information to identify slow pages and optimize user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}