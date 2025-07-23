"use client";

import AdminProvider from "@/components/providers/AdminProvider";
import AuthenticationProvider from "@/components/providers/AuthProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
          <div className="bg-accent flex min-h-screen w-full">
            <AdminSidebar />
            <SidebarInset className="flex-1">
              <main className="w-full">
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
