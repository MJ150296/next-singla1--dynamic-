"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, MapPin, Users, RefreshCw, Building2, Navigation } from "lucide-react";
import "@/app/enterprise-theme.css";

interface CountryData {
  country: string;
  users: number;
  sessions: number;
}

interface CityData {
  city: string;
  country: string;
  users: number;
  sessions: number;
}

interface RegionData {
  region: string;
  country: string;
  users: number;
  sessions: number;
}

interface GeographicData {
  countries: CountryData[];
  cities: CityData[];
  regions: RegionData[];
  serviceAreaTraffic: RegionData[];
  totalCountries: number;
  totalCities: number;
  period: string;
}

export default function GeographicDataClient() {
  const [geoData, setGeoData] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGeoData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/geographic-data?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch geographic data");
      }

      if (result.success) {
        console.log("🌍 Geographic Data Response:", result.data);
        setGeoData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching geographic data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchGeoData();
  }, [fetchGeoData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGeoData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchGeoData]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="enterprise-brand-icon h-10 w-10">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                Geographic & Location Data
              </h1>
              <p className="enterprise-subtitle mt-1">
                Monitor visitor locations and service area traffic analytics.
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
              onClick={fetchGeoData}
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
              <p className="text-sm font-medium text-red-800">Error loading geographic data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Service Area Traffic */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
              <Navigation className="h-5 w-5 text-[var(--enterprise-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Service Area Traffic
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Visitors from your service regions (Delhi NCR)
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  Region
                </th>
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
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--enterprise-border-light)]">
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : geoData?.serviceAreaTraffic.length ? (
                geoData.serviceAreaTraffic.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)]">
                          {item.region}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--enterprise-text-muted)]">
                      {item.country}
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
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No service area traffic data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Countries */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Visitor Countries
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Top countries accessing the site
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
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : geoData?.countries.length ? (
                geoData.countries.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-blue-500" />
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

      {/* Visitor Cities */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Visitor Cities
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                Top cities accessing the site
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--enterprise-border-light)] bg-[var(--enterprise-surface-elevated)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  City
                </th>
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
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-[var(--enterprise-surface-elevated)] rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : geoData?.cities.length ? (
                geoData.cities.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--enterprise-border-light)] last:border-b-0 hover:bg-[var(--enterprise-surface-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="font-medium text-[var(--enterprise-text-primary)]">
                          {item.city}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--enterprise-text-muted)]">
                      {item.country}
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
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--enterprise-text-muted)]">
                    No city data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-info)]/10 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-[var(--enterprise-info)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--enterprise-text-primary)] mb-1">
              About Geographic Data
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              This data shows where your website visitors are located geographically. Use this information to understand your audience better and optimize your marketing efforts for specific regions. The service area traffic highlights visitors from your primary business regions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}