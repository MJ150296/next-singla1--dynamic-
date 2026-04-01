"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Globe, FileText, TrendingUp, RefreshCw, MousePointerClick, Eye, Target, Award, Monitor, Tablet, Smartphone } from "lucide-react";
import "@/app/enterprise-theme.css";

interface OverviewData {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
}

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface DeviceData {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface CountryData {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCData {
  overview: OverviewData;
  topQueries: QueryData[];
  topPages: PageData[];
  deviceBreakdown: DeviceData[];
  countryBreakdown: CountryData[];
  period: number;
  note: string | null;
}

export default function GSCPerformanceClient() {
  const [gscData, setGscData] = useState<GSCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGSCData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/gsc-performance?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch GSC data");
      }

      if (result.success) {
        console.log("🔍 GSC Data Response:", result.data);
        setGscData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching GSC data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchGSCData();
  }, [fetchGSCData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGSCData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchGSCData]);

  const getDeviceIcon = (device: string) => {
    switch (device.toUpperCase()) {
      case "MOBILE":
        return Smartphone;
      case "DESKTOP":
        return Monitor;
      case "TABLET":
        return Tablet;
      default:
        return Monitor;
    }
  };

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
                Search Console Performance
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor your website&#39;s search performance from Google Search Console.
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
              onClick={fetchGSCData}
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
      {gscData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Google Search Console</p>
              <p className="text-sm text-blue-600 mt-1">{gscData.note}</p>
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
              <p className="text-sm font-medium text-red-800">Error loading GSC data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Console Overview */}
      {gscData?.overview && (
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Search Performance Overview
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Last {gscData.period} days
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <MousePointerClick className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {gscData.overview.totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Total Clicks</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {gscData.overview.totalImpressions.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Impressions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10">
              <Target className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {gscData.overview.avgCtr.toFixed(2)}%
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Avg CTR</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
                {gscData.overview.avgPosition.toFixed(1)}
              </p>
              <p className="text-xs text-[var(--enterprise-text-muted)]">Avg Position</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Search Queries */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Top Search Queries
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Keywords driving traffic to your site
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Query
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Clicks
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Impressions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  CTR
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Position
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
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : gscData?.topQueries.length ? (
                gscData.topQueries.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Search className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)]">
                          {item.query}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.impressions.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-semibold ${item.position <= 10 ? 'text-green-500' : item.position <= 20 ? 'text-orange-500' : 'text-red-500'}`}>
                        {item.position.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No query data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Pages */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Top Pages
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Pages receiving the most search traffic
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
                  Clicks
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Impressions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  CTR
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Position
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
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : gscData?.topPages.length ? (
                gscData.topPages.map((item, index) => (
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
                        {item.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.impressions.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-semibold ${item.position <= 10 ? 'text-green-500' : item.position <= 20 ? 'text-orange-500' : 'text-red-500'}`}>
                        {item.position.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No page data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Device Breakdown
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Search performance by device type
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
                  Clicks
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Impressions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  CTR
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Position
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
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : gscData?.deviceBreakdown.length ? (
                gscData.deviceBreakdown.map((item, index) => {
                  const DeviceIcon = getDeviceIcon(item.device);
                  return (
                    <tr
                      key={index}
                      className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <DeviceIcon className="h-4 w-4 text-orange-500" />
                          </div>
                          <span className="font-medium text-[var(--enterprise-text-primary)]">
                            {item.device}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.impressions.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                          {item.ctr.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-semibold ${item.position <= 10 ? 'text-green-500' : item.position <= 20 ? 'text-orange-500' : 'text-red-500'}`}>
                          {item.position.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No device data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Breakdown */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Country Breakdown
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Search performance by country
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
                  Clicks
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Impressions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  CTR
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Position
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
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : gscData?.countryBreakdown.length ? (
                gscData.countryBreakdown.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)]">
                          {item.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.impressions.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                        {item.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-semibold ${item.position <= 10 ? 'text-green-500' : item.position <= 20 ? 'text-orange-500' : 'text-red-500'}`}>
                        {item.position.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No country data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Award className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Google Search Console
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Google Search Console provides insights into how Google sees your website. It shows which queries bring users to your site, which pages are indexed, and how your site performs in search results. Connect your Google Search Console property to see real data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}