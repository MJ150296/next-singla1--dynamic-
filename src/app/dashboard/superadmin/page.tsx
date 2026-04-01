import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import RegisterClientAdminForm from "./RegisterClientAdminForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Shield, Activity, TrendingUp, UserCog } from "lucide-react";
import "@/app/enterprise-theme.css";

export default async function SuperAdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SuperAdmin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="enterprise-animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="enterprise-brand-icon h-10 w-10">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight enterprise-title">
              SuperAdmin Dashboard
            </h1>
            <p className="enterprise-subtitle mt-1">
              Welcome back, {session.user?.name}! You have full system access.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Total Users</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">--</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[var(--enterprise-primary)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <TrendingUp className="mr-1 h-3 w-3 text-[var(--enterprise-success)]" />
            <span>Active accounts</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Client Admins</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">--</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-accent)]/10 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-[var(--enterprise-accent)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <Activity className="mr-1 h-3 w-3 text-[var(--enterprise-info)]" />
            <span>Registered admins</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">System Status</p>
              <p className="text-2xl font-bold text-[var(--enterprise-success)]">Active</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[var(--enterprise-success)]/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[var(--enterprise-success)]" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <div className="mr-1 h-2 w-2 rounded-full bg-[var(--enterprise-success)]"></div>
            <span>All systems operational</span>
          </div>
        </div>

        <div className="enterprise-dashboard-card p-6 enterprise-animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--enterprise-text-muted)]">Security</p>
              <p className="text-2xl font-bold text-[var(--enterprise-text-primary)]">High</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-[var(--enterprise-text-muted)]">
            <Shield className="mr-1 h-3 w-3 text-red-500" />
            <span>Enterprise protection</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Register Client Admin Card */}
        <div className="enterprise-dashboard-card enterprise-animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 border-b border-[var(--enterprise-border-light)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[var(--enterprise-primary)]/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-[var(--enterprise-primary)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">
                  Register New Client Admin
                </h2>
                <p className="text-sm text-[var(--enterprise-text-muted)]">
                  Create new client administrator accounts
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <RegisterClientAdminForm />
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
                  System events and notifications
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-success)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">System initialized</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">Enterprise dashboard is ready</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-info)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">SuperAdmin logged in</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">{session.user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--enterprise-surface-elevated)]">
                <div className="h-2 w-2 rounded-full bg-[var(--enterprise-primary)] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-[var(--enterprise-text-primary)]">Enterprise theme active</p>
                  <p className="text-xs text-[var(--enterprise-text-muted)]">Professional interface enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}