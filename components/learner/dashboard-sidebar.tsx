"use client";

import * as React from "react";
import {
  BookOpen,
  Award,
  BarChart2,
  Calendar,
  Star,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "dashboard";
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

  const navigationGroups = [
    {
      title: "Main",
      items: mainNavItems,
    },
    {
      title: "Study Resources",
      items: resourceNavItems,
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Exam Hub</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between">
        <div>
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={activePage === item.id}
                      >
                        <a href={item.path} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        <SidebarGroup>
          <Separator className="my-2" />
          <SidebarGroupContent className="py-2">
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={activePage === item.id}>
                    <Link href={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
