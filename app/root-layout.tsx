"use client";

import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, useEffect } from "react";
import { useUserStore } from "@/lib/stores/user-store";
import { useExamSessionStore } from "@/lib/stores/exam-session-store";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

  const loader = (
    <div className="flex h-full w-full items-center justify-center">
      <DotLottieReact
        src="/loading.lottie"
        loop
        autoplay
        className="h-40 w-auto"
      />
    </div>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <Providers>
          <Suspense fallback={loader}>{children}</Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
