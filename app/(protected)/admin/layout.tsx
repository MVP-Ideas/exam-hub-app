"use client";

import AdminProvider from "@/components/providers/admin-provider";
import AuthenticationProvider from "@/components/providers/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticationProvider>
      <AdminProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <SidebarInset className="flex-1">
              <main className="bg-accent min-h-screen w-full">
                <SidebarTrigger className="px-10 pt-10 md:hidden" />

                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AdminProvider>
    </AuthenticationProvider>
  );
}
