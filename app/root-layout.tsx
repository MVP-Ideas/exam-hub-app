"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, useEffect } from "react";
import { useUserStore } from "@/lib/stores/user-store";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import Loading from "./loading";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    useUserStore.persist.rehydrate();
    useExamSessionStore.persist.rehydrate();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
