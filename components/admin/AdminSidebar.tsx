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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeDropdown } from "../common/ThemeDropdown";

interface NavGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "admin";
  const [activeTab, setActiveTab] = useState(activePage);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "exam-management",
    "question-management",
  ]);

  // Navigation groups with collapsible structure
  const navGroups: NavGroup[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      id: "learner-management",
      label: "Learner Management",
      icon: Users,
      href: "/admin/learner-management",
    },
    {
      id: "question-management",
      label: "Question Management",
      icon: FileQuestion,
      children: [
        {
          id: "question-bank",
          label: "Question Bank",
          href: "/admin/question-bank",
        },
        {
          id: "generate-questions",
          label: "Generate Questions",
          href: "/admin/generate-questions",
        },
        {
          id: "question-categories",
          label: "Question Categories",
          href: "/admin/question-categories",
        },
      ],
    },
    {
      id: "exam-management",
      label: "Exam Management",
      icon: TestTube,
      children: [
        {
          id: "exam-hub",
          label: "Exam Hub",
          href: "/admin/exams",
        },
        {
          id: "exam-sessions",
          label: "Exam Sessions",
          href: "/admin/exams/sessions",
        },
        {
          id: "pending-reviews",
          label: "Pending Reviews",
          href: "/admin/exams/sessions/reviews",
        },
      ],
    },
  ];

  const bottomNavItems = [
    {
      label: "Learner Mode",
      icon: User,
      path: "/dashboard",
      id: "dashboard-learner",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
      id: "settings",
    },
    { label: "Sign Out", icon: LogOut, path: "/logout", id: "logout" },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId);

  const renderNavGroup = (group: NavGroup) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = isGroupExpanded(group.id);

    if (!hasChildren) {
      // Render as a single navigation item
      return (
        <Button
          variant="ghost"
          key={group.id}
          onClick={() => setActiveTab(group.id)}
          className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
          asChild
        >
          <Link href={group.href!}>
            {activeTab === group.id && (
              <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
            )}
            <div
              className={`flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold ${
                activeTab === group.id
                  ? "bg-muted text-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <group.icon className="ml-4 h-4 w-4" />
              {group.label}
            </div>
          </Link>
        </Button>
      );
    }

    // Render as a collapsible group
    return (
      <Collapsible
        key={group.id}
        open={isExpanded}
        onOpenChange={() => toggleGroup(group.id)}
        className="space-y-1"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
          >
            <div className="text-foreground hover:bg-muted flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-semibold">
              <group.icon className="ml-4 h-4 w-4" />
              <span className="flex-1">{group.label}</span>
              {isExpanded ? (
                <ChevronDown className="mr-2 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-2 h-4 w-4" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1">
          {group.children!.map((child) => (
            <Button
              variant="ghost"
              key={child.id}
              onClick={() => setActiveTab(child.id)}
              className="relative flex w-full items-center bg-transparent hover:bg-transparent dark:hover:bg-transparent"
              asChild
            >
              <Link href={child.href}>
                {activeTab === child.id && (
                  <div className="bg-primary absolute top-0 left-0 h-full w-1 rounded-r-full" />
                )}
                <div
                  className={`ml-6 flex flex-1 flex-row items-center gap-2 rounded-sm py-2 text-left font-medium ${
                    activeTab === child.id
                      ? "bg-muted text-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="ml-4">{child.label}</span>
                </div>
              </Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

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
          <nav className="space-y-1">{navGroups.map(renderNavGroup)}</nav>
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
                className="relative flex w-full items-center gap-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
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
