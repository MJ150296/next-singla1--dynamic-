import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Shield, Activity, TrendingUp, Settings, FileText, BarChart3, Globe, Monitor, MapPin } from "lucide-react";
import "@/app/enterprise-theme.css";

export default async function ClientAdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="enterprise-brand-icon h-10 w-10">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight enterprise-title">
              Client Admin Dashboard
            </h1>
            <p className="enterprise-subtitle mt-1">
              Welcome back, {session.user?.name}! Manage your clients and services.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">My Clients</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">--</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[var(--enterprise-primary)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <TrendingUp className="mr-1 h-3 w-3 text-[var(--enterprise-success)]" />
            <span>Active clients</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Services</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">--</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-accent)]/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[var(--enterprise-accent)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <Activity className="mr-1 h-3 w-3 text-[var(--enterprise-info)]" />
            <span>Active services</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Status</p>
              <p className="text-2xl font-bold text-[var(--enterprise-success)]">Active</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-success)]/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[var(--enterprise-success)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <div className="mr-1 h-2 w-2 rounded-full bg-[var(--enterprise-success)]"></div>
            <span>Account active</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Access Level</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-secondary)]/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[var(--enterprise-secondary)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <Shield className="mr-1 h-3 w-3 text-[var(--enterprise-secondary)]" />
            <span>Client administrator</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-[var(--enterprise-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Quick Actions
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Manage your account and services
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-3">
              <Link href="/dashboard/clientadmin/traffic-metrics" className="enterprise-btn w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Traffic Metrics
              </Link>
              <Link href="/dashboard/clientadmin/seo-analytics" className="enterprise-btn w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                SEO Analytics
              </Link>
              <Link href="/dashboard/clientadmin/device-analytics" className="enterprise-btn w-full justify-start">
                <Monitor className="mr-2 h-4 w-4" />
                Device Analytics
              </Link>
              <Link href="/dashboard/clientadmin/geographic-data" className="enterprise-btn w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Geographic Data
              </Link>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-accent)]/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-[var(--enterprise-accent)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Recent Activity
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Your recent actions and updates
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-success)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">Dashboard loaded</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">Client admin portal ready</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-info)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">Session active</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">{session.user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-primary)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">Enterprise features enabled</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">Professional interface active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}