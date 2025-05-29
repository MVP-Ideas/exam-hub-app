"use client";
import AppLoader from "@/components/common/app-loader";

export default function Loading() {
  return (
    <div className="bg-primary flex h-screen w-screen items-center justify-center">
      <AppLoader />
    </div>
  );
}
