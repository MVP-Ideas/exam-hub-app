"use client";

import * as React from "react";
import { useState } from "react";
import {
  BookOpen,
  Award,
  BarChart2,
  Calendar,
  Star,
  Settings,
  LogOut,
  HelpCircle,
  Plus,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/user-store";
import { UserState } from "@/lib/stores/user-store";
import { ThemeDropdown } from "../common/ThemeDropdown";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "dashboard";
  const [activeTab, setActiveTab] = useState(activePage);
  const { user } = useUserStore((state: UserState) => ({
    user: state.user,
  }));

  // Navigation items with their icons and paths
  const mainNavItems = [
    { label: "Dashboard", icon: BookOpen, path: "/dashboard", id: "dashboard" },
    { label: "Available Exams", icon: Award, path: "/exams", id: "exams" },
    {
      label: "Analytics",
      icon: BarChart2,
      path: "/analytics",
      id: "analytics",
      disabled: true,
    },
    {
      label: "Study Plan",
      icon: Calendar,
      path: "/study-plan",
      id: "study-plan",
      disabled: true,
    },
  ];

  const resourceNavItems = [
    {
      label: "Library",
      icon: BookOpen,
      path: "/library",
      id: "library",
      disabled: true,
    },
    {
      label: "Bookmarks",
      icon: Star,
      path: "/bookmarks",
      id: "bookmarks",
      disabled: true,
    },
    {
      label: "Help Center",
      icon: HelpCircle,
      path: "/help",
      id: "help",
      disabled: true,
    },
  ];

  const bottomNavItems = [
    {
      label: "Admin Mode",
      icon: Shield,
      path: "/admin",
      id: "admin",
      visible: user?.role === "Admin",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      id: "settings",
      disabled: true,
      visible: true,
    },
    {
      label: "Sign Out",
      icon: LogOut,
      path: "/logout",
      id: "logout",
      visible: true,
    },
  ];

  return (
    <Sidebar {...props} className="bg-background flex h-full">
      <SidebarHeader className="py-4">
        <div className="flex w-full flex-row items-center justify-center">
          <h1 className="text-2xl font-bold">Exam Hub</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="border-muted flex w-full flex-col border-r">
        {/* Main Navigation */}
        <div className="py-2">
          <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
            Main
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                asChild
              >
                <Link href={item.disabled ? "#" : item.path}>
                  {activeTab === item.id && (
                    <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
                  )}

                  <div
                    className={`flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold ${
                      activeTab === item.id
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="ml-4 h-4 w-4" />
                    {item.label}
                    {item.disabled && (
                      <p className="text-muted-foreground text-xs">(Ongoing)</p>
                    )}
                  </div>
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Study Resources Section */}
        <div className="py-2">
          <Separator className="my-2" />
          <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
            Study Resources
          </div>
          <nav className="space-y-1">
            {resourceNavItems.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                asChild
                disabled={item.disabled}
              >
                <Link href={item.disabled ? "#" : item.path}>
                  {activeTab === item.id && (
                    <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
                  )}

                  <div
                    className={`flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold ${
                      activeTab === item.id
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="ml-4 h-4 w-4" />
                    {item.label}
                    {item.disabled && (
                      <p className="text-muted-foreground text-xs">(Ongoing)</p>
                    )}
                  </div>
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Quick Actions Section */}
        <div className="py-2">
          <Separator className="my-2" />
          <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
            Quick Actions
          </div>
          <div className="px-4 py-2">
            <Button
              variant="outline"
              className="w-full justify-start rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Study Set
            </Button>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-0 pb-4">
        {/* Theme Selector */}
        <div>
          <Separator className="my-2" />
          <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
            Appearance
          </div>
          <div className="px-4">
            <ThemeDropdown />
          </div>
        </div>

        {/* Other Navigation */}
        <div>
          <Separator className="my-2" />
          <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
            Account
          </div>
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                asChild
                hidden={!item.visible}
                disabled={item.disabled}
              >
                <Link href={item.path}>
                  {activeTab === item.id && (
                    <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
                  )}
                  <div
                    className={`flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold ${
                      activeTab === item.id
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="ml-4 h-4 w-4" />
                    {item.label}
                    {item.disabled && (
                      <p className="text-muted-foreground text-xs">(Ongoing)</p>
                    )}
                  </div>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
