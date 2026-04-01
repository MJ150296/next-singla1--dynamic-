"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, Eye, Users, Clock, MousePointerClick, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import "@/app/enterprise-theme.css";

interface TrafficMetricsData {
  totalPageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  date: string;
}

interface Metric {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  color: string;
  bgColor: string;
  format: "number" | "percentage" | "duration" | "decimal";
}

export default function TrafficMetricsClient() {
  const [metricsData, setMetricsData] = useState<TrafficMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatValue = (value: number, format: Metric["format"]): string | number => {
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "duration":
        return formatDuration(value);
      case "decimal":
        return value.toFixed(1);
      default:
        return value.toLocaleString();
    }
  };

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/traffic-metrics?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch metrics");
      }

      if (result.success) {
        console.log("📊 Traffic Metrics Response:", {
          source: result.source,
          period: result.period,
          data: result.data
        });
        setMetricsData(result.data);
        setLastUpdated(new Date());
        setDataSource(result.source || "unknown");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching traffic metrics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const metrics: Metric[] = [
    {
      name: "Total Page Views",
      description: "Number of times pages were viewed",
      icon: Eye,
      value: metricsData ? formatValue(metricsData.totalPageViews, "number") : "--",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      format: "number",
    },
    {
      name: "Unique Visitors",
      description: "Distinct users visiting the site",
      icon: Users,
      value: metricsData ? formatValue(metricsData.uniqueVisitors, "number") : "--",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      format: "number",
    },
    {
      name: "Sessions",
      description: "Number of browsing sessions",
      icon: Activity,
      value: metricsData ? formatValue(metricsData.sessions, "number") : "--",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      format: "number",
    },
    {
      name: "Bounce Rate",
      description: "% of single-page visits",
      icon: MousePointerClick,
      value: metricsData ? formatValue(metricsData.bounceRate, "percentage") : "--",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      format: "percentage",
    },
    {
      name: "Average Session Duration",
      description: "Time users spend on site",
      icon: Clock,
      value: metricsData ? formatValue(metricsData.avgSessionDuration, "duration") : "--",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      format: "duration",
    },
    {
      name: "Pages Per Session",
      description: "Average pages viewed per visit",
      icon: BarChart3,
      value: metricsData ? formatValue(metricsData.pagesPerSession, "decimal") : "--",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      format: "decimal",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="enterprise-brand-icon h-10 w-10">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                Traffic & Visits Metrics
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor your website traffic and visitor engagement statistics.
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
              onClick={fetchMetrics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--enterprise-primary)] text-white rounded-lg hover:bg-[var(--enterprise-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            {dataSource && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                dataSource === "google_analytics" 
                  ? "bg-green-100 text-green-700" 
                  : dataSource === "database"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {dataSource === "google_analytics" ? "📊 Google Analytics" : 
                 dataSource === "database" ? "💾 Database" : 
                 "🎲 Sample Data"}
              </span>
            )}
          </div>
        )}
      </div>

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
              <p className="text-sm font-medium text-red-800">Error loading metrics</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Table */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[var(--enterprise-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Website Metrics Overview
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Key performance indicators for your website
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Metric
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={metric.name}
                  className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <span className="font-medium text-[var(--enterprise-text-primary)]">
                        {metric.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--enterprise-text-muted)]">
                    {metric.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {loading ? (
                      <div className="h-6 w-16 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div>
                    ) : (
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {metric.value}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Traffic Metrics
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              These metrics provide insights into how users interact with your website. 
              Track page views to understand content popularity, monitor unique visitors to gauge audience size, 
              and analyze session data to optimize user engagement. Data refreshes automatically every 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}