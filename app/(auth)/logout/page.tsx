"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Page() {
  const { handleLogout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      handleLogout();
    }
  }, [handleLogout, isLoading]);

  return (
    <div className="text-primary-foreground bg-primary flex h-screen w-full flex-col items-center justify-center">
      <DotLottieReact
        src="/loading.lottie"
        loop
        autoplay
        speed={0.5}
        className="h-40 w-auto"
      />
      <h1 className="text-2xl font-bold">Logging out...</h1>
      <p>Please wait...</p>
      <p>You will be redirected shortly.</p>
      <p>If not, please click the button below.</p>
      <Button variant="default" onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </div>
  );
}
