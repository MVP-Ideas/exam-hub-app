"use client";

import AuthenticationProvider from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticationProvider>
      <SidebarProvider>
        <main className="h-screen w-full">{children}</main>
      </SidebarProvider>
    </AuthenticationProvider>
  );
}
