"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, Monitor, Smartphone, Tablet, Globe, RefreshCw, MapPin, Users } from "lucide-react";
import "@/app/enterprise-theme.css";

interface ActivePageData {
  path: string;
  title: string;
  users: number;
}

interface LocationData {
  country: string;
  city: string;
  users: number;
}

interface DeviceData {
  device: string;
  users: number;
}

interface RealtimeData {
  activeUsers: number;
  activePages: ActivePageData[];
  locations: LocationData[];
  devices: DeviceData[];
  lastUpdated: string;
}

export default function RealtimeAnalyticsClient() {
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRealtimeData = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/api/realtime-analytics");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch realtime analytics");
      }

      if (result.success) {
        console.log("⚡ Real-Time Data Response:", result.data);
        setRealtimeData(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching realtime analytics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealtimeData();
  }, [fetchRealtimeData]);

  // Auto-refresh every 10 seconds for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealtimeData();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchRealtimeData]);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return <Monitor className="h-4 w-4 text-blue-500" />;
      case "mobile":
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case "tablet":
        return <Tablet className="h-4 w-4 text-purple-500" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />;
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
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                Real-Time Analytics
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor live visitor activity on your website.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRealtimeData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--enterprise-primary)] text-white rounded-lg hover:bg-[var(--enterprise-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        {realtimeData?.lastUpdated && (
          <p className="text-sm text-[var(--enterprise-text-muted)] mt-2">
            Last updated: {new Date(realtimeData.lastUpdated).toLocaleTimeString()} (auto-refreshes every 10s)
          </p>
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
              <p className="text-sm font-medium text-red-800">Error loading realtime analytics</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Users Now */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Active Users Now
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Current visitors on site
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="h-16 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div>
          ) : (
            <div className="text-center">
              <span className="text-5xl font-bold text-[var(--enterprise-primary)]">
                {realtimeData?.activeUsers || 0}
              </span>
              <p className="text-sm text-[var(--enterprise-text-muted)] mt-2">
                visitors active in the last 5 minutes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Pages */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Active Pages
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Pages being viewed right now
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : realtimeData?.activePages.length ? (
                realtimeData.activePages.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <span className="font-medium text-[var(--enterprise-text-primary)]">
                            {item.title || item.path}
                          </span>
                          <p className="text-xs text-[var(--enterprise-text-muted)] mt-0.5">
                            {item.path}
                          </p>
                        </div>
                      </div>
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
                  <td colSpan={2} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No active pages data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Location Map */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Live Location Map
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Real-time visitor locations
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Location
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Users
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : realtimeData?.locations.length ? (
                realtimeData.locations.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <span className="font-medium text-[var(--enterprise-text-primary)]">
                            {item.city}
                          </span>
                          <p className="text-xs text-[var(--enterprise-text-muted)] mt-0.5">
                            {item.country}
                          </p>
                        </div>
                      </div>
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
                  <td colSpan={2} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No location data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Device Info */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Live Device Info
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Current devices in use
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Device Type
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
                  </tr>
                ))
              ) : realtimeData?.devices.length ? (
                realtimeData.devices.map((item, index) => (
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
                        {item.users.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No device data available
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
            <Activity className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Real-Time Analytics
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              This data shows live visitor activity on your website. The data refreshes automatically every 10 seconds to provide up-to-the-minute insights into current site usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}