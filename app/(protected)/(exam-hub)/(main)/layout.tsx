"use client";

import { DashboardSidebar } from "@/components/learner/DashboardSidebar";
import PageFooter from "@/components/learner/PageFooter";
import PageHeader from "@/components/learner/PageHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <div className="flex w-full max-w-full flex-col overflow-x-hidden">
        <PageHeader />

        <main className="h-full flex-1">{children}</main>

        <PageFooter />
      </div>
    </SidebarProvider>
  );
}
