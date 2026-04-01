"use client";

import { useState, useEffect, useCallback } from "react";
import { Gauge, CheckCircle, XCircle, AlertTriangle, RefreshCw, Smartphone, Lock, Info, TrendingUp } from "lucide-react";
import "@/app/enterprise-theme.css";

interface CoreWebVital {
  value: number;
  unit: string;
  status: string;
  percentile: number;
}

interface CoreWebVitals {
  lcp: CoreWebVital;
  fid: CoreWebVital;
  cls: CoreWebVital;
}

interface PageExperience {
  goodUrls: number;
  needsImprovementUrls: number;
  poorUrls: number;
  goodPercentage: number;
}

interface MobileUsability {
  goodUrls: number;
  issues: number;
  goodPercentage: number;
}

interface Https {
  secureUrls: number;
  insecureUrls: number;
  securePercentage: number;
}

interface PageExperienceData {
  coreWebVitals: CoreWebVitals;
  pageExperience: PageExperience;
  mobileUsability: MobileUsability;
  https: Https;
  note: string | null;
}

export default function GSCPageExperienceClient() {
  const [pageExperienceData, setPageExperienceData] = useState<PageExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("today");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPageExperienceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/gsc-page-experience?period=${period}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch page experience data");
      }

      if (result.success) {
        console.log("📊 Page Experience Data Response:", result.data);
        setPageExperienceData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching page experience data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchPageExperienceData();
  }, [fetchPageExperienceData, period]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPageExperienceData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchPageExperienceData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "text-green-500";
      case "Needs Improvement":
        return "text-orange-500";
      case "Poor":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-500/10";
      case "Needs Improvement":
        return "bg-orange-500/10";
      case "Poor":
        return "bg-red-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Good":
        return CheckCircle;
      case "Needs Improvement":
        return AlertTriangle;
      case "Poor":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enterprise-animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="enterprise-brand-icon h-10 w-10">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight enterprise-title">
                  Page Experience
                </h1>
                <p className="enterprise-subtitle mt-1">
                  Monitor Core Web Vitals and page experience signals.
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
                onClick={fetchPageExperienceData}
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
      {pageExperienceData?.note && (
        <div className="enterprise-dashboard-card p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Google Search Console</p>
              <p className="text-sm text-blue-600 mt-1">{pageExperienceData.note}</p>
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
              <p className="text-sm font-medium text-red-800">Error loading page experience data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      {pageExperienceData?.coreWebVitals && (
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Core Web Vitals
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Key metrics for user experience
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* LCP */}
            <div className="text-center p-6 rounded-lg border border-[var(--enterprise-border-light)]">
              <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getStatusBgColor(pageExperienceData.coreWebVitals.lcp.status)}`}>
                {(() => {
                  const StatusIcon = getStatusIcon(pageExperienceData.coreWebVitals.lcp.status);
                  return <StatusIcon className={`h-8 w-8 ${getStatusColor(pageExperienceData.coreWebVitals.lcp.status)}`} />;
                })()}
              </div>
              <p className="text-3xl font-bold text-[var(--enterprise-text-primary)] mb-1">
                {pageExperienceData.coreWebVitals.lcp.value}{pageExperienceData.coreWebVitals.lcp.unit}
              </p>
              <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">LCP</p>
              <p className="text-xs text-[var(--enterprise-text-muted)] mt-1">Largest Contentful Paint</p>
              <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${getStatusBgColor(pageExperienceData.coreWebVitals.lcp.status)} ${getStatusColor(pageExperienceData.coreWebVitals.lcp.status)}`}>
                {pageExperienceData.coreWebVitals.lcp.status}
              </span>
            </div>

            {/* FID */}
            <div className="text-center p-6 rounded-lg border border-[var(--enterprise-border-light)]">
              <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getStatusBgColor(pageExperienceData.coreWebVitals.fid.status)}`}>
                {(() => {
                  const StatusIcon = getStatusIcon(pageExperienceData.coreWebVitals.fid.status);
                  return <StatusIcon className={`h-8 w-8 ${getStatusColor(pageExperienceData.coreWebVitals.fid.status)}`} />;
                })()}
              </div>
              <p className="text-3xl font-bold text-[var(--enterprise-text-primary)] mb-1">
                {pageExperienceData.coreWebVitals.fid.value}{pageExperienceData.coreWebVitals.fid.unit}
              </p>
              <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">FID</p>
              <p className="text-xs text-[var(--enterprise-text-muted)] mt-1">First Input Delay</p>
              <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${getStatusBgColor(pageExperienceData.coreWebVitals.fid.status)} ${getStatusColor(pageExperienceData.coreWebVitals.fid.status)}`}>
                {pageExperienceData.coreWebVitals.fid.status}
              </span>
            </div>

            {/* CLS */}
            <div className="text-center p-6 rounded-lg border border-[var(--enterprise-border-light)]">
              <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getStatusBgColor(pageExperienceData.coreWebVitals.cls.status)}`}>
                {(() => {
                  const StatusIcon = getStatusIcon(pageExperienceData.coreWebVitals.cls.status);
                  return <StatusIcon className={`h-8 w-8 ${getStatusColor(pageExperienceData.coreWebVitals.cls.status)}`} />;
                })()}
              </div>
              <p className="text-3xl font-bold text-[var(--enterprise-text-primary)] mb-1">
                {pageExperienceData.coreWebVitals.cls.value}
              </p>
              <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">CLS</p>
              <p className="text-xs text-[var(--enterprise-text-muted)] mt-1">Cumulative Layout Shift</p>
              <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${getStatusBgColor(pageExperienceData.coreWebVitals.cls.status)} ${getStatusColor(pageExperienceData.coreWebVitals.cls.status)}`}>
                {pageExperienceData.coreWebVitals.cls.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page Experience Overview */}
      <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-6 border-b border-[var(--enterprise-border-light)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                Page Experience Overview
              </h2>
              <p className="text-sm text-[var(--enterprise-text-muted)]">
                URLs with good page experience
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className="text-center p-4 rounded-lg bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
              {pageExperienceData?.pageExperience.goodUrls.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--enterprise-text-muted)]">Good URLs</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-500/10">
            <AlertTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
              {pageExperienceData?.pageExperience.needsImprovementUrls.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--enterprise-text-muted)]">Needs Improvement</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-500/10">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
              {pageExperienceData?.pageExperience.poorUrls.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--enterprise-text-muted)]">Poor URLs</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-500/10">
            <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">
              {pageExperienceData?.pageExperience.goodPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-[var(--enterprise-text-muted)]">Good Rate</p>
          </div>
        </div>
      </div>

      {/* Mobile Usability & HTTPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Usability */}
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Mobile Usability
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Mobile-friendly page status
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--enterprise-text-primary)]">Good URLs</span>
              <span className="text-lg font-semibold text-green-500">
                {pageExperienceData?.mobileUsability.goodUrls.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--enterprise-text-primary)]">Issues</span>
              <span className="text-lg font-semibold text-orange-500">
                {pageExperienceData?.mobileUsability.issues}
              </span>
            </div>
            <div className="pt-4 border-t border-[var(--enterprise-border-light)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--enterprise-text-muted)]">Good Rate</span>
                <span className="text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  {pageExperienceData?.mobileUsability.goodPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[var(--enterprise-surface-elevated)] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pageExperienceData?.mobileUsability.goodPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* HTTPS */}
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  HTTPS Security
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Secure connection status
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--enterprise-text-primary)]">Secure URLs</span>
              <span className="text-lg font-semibold text-green-500">
                {pageExperienceData?.https.secureUrls.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--enterprise-text-primary)]">Insecure URLs</span>
              <span className="text-lg font-semibold text-red-500">
                {pageExperienceData?.https.insecureUrls}
              </span>
            </div>
            <div className="pt-4 border-t border-[var(--enterprise-border-light)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--enterprise-text-muted)]">Secure Rate</span>
                <span className="text-sm font-semibold text-[var(--enterprise-text-primary)]">
                  {pageExperienceData?.https.securePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-[var(--enterprise-surface-elevated)] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pageExperienceData?.https.securePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
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
              About Page Experience
            </h3>
            <p className="text-sm text-[var(--enterprise-text-muted)]">
              Page Experience measures how users perceive the experience of interacting with your web pages. Core Web Vitals (LCP, FID, CLS) are key metrics that measure loading performance, interactivity, and visual stability. Good page experience can improve your search rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}