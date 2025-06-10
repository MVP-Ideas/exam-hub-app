"use client";

import * as React from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  TestTube,
  Settings,
  LogOut,
  User,
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
import { ThemeDropdown } from "../common/theme-dropdown";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "admin";
  const [activeTab, setActiveTab] = useState(activePage);

  // Main navigation items
  const navItems = [
    {
      href: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
      id: "admin",
    },
    {
      href: "/admin/learner-management",
      icon: Users,
      label: "Learner Management",
      id: "learner-management",
    },
    {
      href: "/admin/question-bank",
      icon: FileQuestion,
      label: "Question Bank",
      id: "question-bank",
    },
    {
      href: "/admin/exams",
      icon: TestTube,
      label: "Exam Management",
      id: "exams",
    },
  ];

  const bottomNavItems = [
    {
      label: "Learner Mode",
      icon: User,
      path: "/dashboard",
      id: "dashboard",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
      id: "settings",
    },
    { label: "Sign Out", icon: LogOut, path: "/logout", id: "logout" },
  ];

  return (
    <Sidebar {...props} className="bg-p flex h-full">
      <SidebarHeader className="py-4">
        <div className="flex w-full flex-row items-center justify-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="border-muted flex w-full flex-col border-r">
        {/* Main Navigation */}
        <div className="py-2">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent"
                asChild
              >
                <Link href={item.href}>
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
                  </div>
                </Link>
              </Button>
            ))}
          </nav>
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
        {/* Account Navigation */}
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
