"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="h-screen w-full">{children}</main>
    </SidebarProvider>
  );
}
