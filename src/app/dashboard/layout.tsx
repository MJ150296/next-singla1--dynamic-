"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Shield,
  UserCog,
  LogOut,
  ChevronDown,
  Home,
  Calendar,
  MessageSquare,
  Bell,
  HelpCircle,
  Activity,
  Monitor,
  Share2,
  PieChart,
  Zap,
  MousePointer,
  Search,
  Gauge,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import EnterpriseThemeToggle from "@/app/components/EnterpriseThemeToggle";
import "@/app/enterprise-theme.css";

// Navigation items configuration
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const getNavSections = (role: string): NavSection[] => {
  const sections: NavSection[] = [
    {
      title: "Platform",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
  ];

  if (role === "ClientAdmin") {
    sections.push(
      {
        title: "Google Analytics 4",
        items: [
          {
            title: "Traffic Metrics",
            url: "/dashboard/clientadmin/traffic-metrics",
            icon: Activity,
          },
          {
            title: "Geographic Data",
            url: "/dashboard/clientadmin/geographic-data",
            icon: BarChart3,
          },
          {
            title: "Device Analytics",
            url: "/dashboard/clientadmin/device-analytics",
            icon: Monitor,
          },
          {
            title: "Traffic Sources",
            url: "/dashboard/clientadmin/traffic-sources",
            icon: Share2,
          },
          {
            title: "Page Analytics",
            url: "/dashboard/clientadmin/page-analytics",
            icon: PieChart,
          },
          {
            title: "Real-Time",
            url: "/dashboard/clientadmin/realtime-analytics",
            icon: Zap,
          },
          {
            title: "User Behavior",
            url: "/dashboard/clientadmin/user-behavior",
            icon: MousePointer,
          },
          {
            title: "Performance",
            url: "/dashboard/clientadmin/performance-metrics",
            icon: Gauge,
          },
        ],
      },
      {
        title: "Google Search Console",
        items: [
          {
            title: "Performance",
            url: "/dashboard/clientadmin/gsc-performance",
            icon: Search,
          },
          {
            title: "Indexing",
            url: "/dashboard/clientadmin/gsc-indexing",
            icon: FileText,
          },
          {
            title: "Sitemap",
            url: "/dashboard/clientadmin/gsc-sitemap",
            icon: FileText,
          },
          {
            title: "Page Experience",
            url: "/dashboard/clientadmin/gsc-page-experience",
            icon: Gauge,
          },
        ],
      }
    );
  }

  return sections;
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="enterprise-bg flex h-screen items-center justify-center">
        <div className="enterprise-card p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--enterprise-primary)] border-t-transparent" />
          <p className="enterprise-subtitle">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const navSections = getNavSections(session.user?.role || "");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ClientAdmin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon" className="enterprise-sidebar font-sans">
        <SidebarHeader className="border-b border-[var(--enterprise-border-light)]">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="enterprise-brand-icon flex aspect-square size-8 items-center justify-center">
                    <Home className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-[var(--enterprise-text-primary)]">Singla RO Mart</span>
                    <span className="truncate text-xs text-[var(--enterprise-text-muted)]">
                      Enterprise Dashboard
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {navSections.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel className="text-[var(--enterprise-text-secondary)] font-medium">{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item: NavItem) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                        className="hover:bg-[var(--enterprise-surface-elevated)] data-[active=true]:bg-[var(--enterprise-primary)] data-[active=true]:text-white"
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

        </SidebarContent>

        <SidebarFooter className="border-t border-[var(--enterprise-border-light)]">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-[var(--enterprise-surface-elevated)] data-[state=open]:text-[var(--enterprise-text-primary)] hover:bg-[var(--enterprise-surface-elevated)]"
                  >
                    <Avatar className="h-8 w-8 rounded-lg ring-2 ring-[var(--enterprise-border)]">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg bg-[var(--enterprise-primary)] text-white">
                        {getInitials(session.user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-[var(--enterprise-text-primary)]">
                        {session.user?.name || "User"}
                      </span>
                      <span className="truncate text-xs text-[var(--enterprise-text-muted)]">
                        {session.user?.email}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-[var(--enterprise-text-muted)]" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="enterprise-card w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg ring-2 ring-[var(--enterprise-border)]">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback className="rounded-lg bg-[var(--enterprise-primary)] text-white">
                          {getInitials(session.user?.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-[var(--enterprise-text-primary)]">
                          {session.user?.name || "User"}
                        </span>
                        <span className="truncate text-xs text-[var(--enterprise-text-muted)]">
                          {session.user?.email}
                        </span>
                        <Badge
                          className={`mt-1 w-fit ${getRoleBadgeColor(session.user?.role || "")}`}
                        >
                          {session.user?.role}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[var(--enterprise-border-light)]" />
                  <DropdownMenuItem asChild className="hover:bg-[var(--enterprise-surface-elevated)] focus:bg-[var(--enterprise-surface-elevated)]">
                    <Link href="/dashboard/profile">
                      <Users className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-[var(--enterprise-surface-elevated)] focus:bg-[var(--enterprise-surface-elevated)]">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[var(--enterprise-border-light)]" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 dark:focus:bg-red-950"
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="font-sans">
        <header className="enterprise-dashboard-header flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1 text-[var(--enterprise-text-secondary)] hover:text-[var(--enterprise-text-primary)]" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-[var(--enterprise-text-primary)]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <EnterpriseThemeToggle />
            </div>
          </div>
        </header>

        <main className="enterprise-dashboard-main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  );
}