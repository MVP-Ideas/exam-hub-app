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

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "dashboard";
  const [activeTab, setActiveTab] = useState(activePage);

  // Navigation items with their icons and paths
  const mainNavItems = [
    { label: "Dashboard", icon: BookOpen, path: "/dashboard", id: "dashboard" },
    { label: "Available Exams", icon: Award, path: "/exams", id: "exams" },
    {
      label: "Analytics",
      icon: BarChart2,
      path: "/analytics",
      id: "analytics",
    },
    {
      label: "Study Plan",
      icon: Calendar,
      path: "/study-plan",
      id: "study-plan",
    },
  ];

  const resourceNavItems = [
    { label: "Library", icon: BookOpen, path: "/library", id: "library" },
    { label: "Bookmarks", icon: Star, path: "/bookmarks", id: "bookmarks" },
    { label: "Help Center", icon: HelpCircle, path: "/help", id: "help" },
  ];

  const bottomNavItems = [
    { label: "Settings", icon: Settings, path: "/settings", id: "settings" },
    { label: "Sign Out", icon: LogOut, path: "/logout", id: "logout" },
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
          <div className="px-4 py-2 text-sm font-medium text-gray-500">
            Main
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent"
                asChild
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
                    <item.icon className="h-4 w-4" />
                    {item.label}
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
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent"
                asChild
              >
                <Link href={item.path}>
                  {activeTab === item.id && (
                    <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
                  )}

                  <div
                    className={`flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold ${
                      activeTab === item.id
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-primary/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
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
        {/* Other Navigation */}
        <div className="py-2">
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
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent"
                asChild
              >
                <Link href={item.path}>
                  {activeTab === item.id && (
                    <div className="bg-foreground absolute top-0 left-0 h-full w-1 rounded-r-full" />
                  )}
                  <item.icon className="ml-4 h-4 w-4" />
                  <div
                    className={`flex-1 rounded-sm px-2 py-2 text-left text-sm font-medium ${
                      activeTab === item.id
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
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
