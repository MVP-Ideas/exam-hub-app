"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AppLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <DotLottieReact
        src="/loading.lottie"
        loop
        autoplay
        className="h-40 w-auto"
      />
    </div>
  );
}
