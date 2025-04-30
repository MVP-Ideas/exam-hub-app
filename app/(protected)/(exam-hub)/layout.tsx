"use client";

import { DashboardSidebar } from "@/components/learner/dashboard-sidebar";
import PageFooter from "@/components/learner/page-footer";
import PageHeader from "@/components/learner/page-header";
import AuthenticationProvider from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticationProvider>
      <SidebarProvider>
        <DashboardSidebar />

        <div className="flex w-full max-w-full flex-col overflow-x-hidden">
          <PageHeader />

          <main className="h-full flex-1">{children}</main>

          <PageFooter />
        </div>
      </SidebarProvider>
    </AuthenticationProvider>
  );
}
