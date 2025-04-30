"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";

export default function Page() {
  const { handleLogout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      handleLogout();
    }
  }, [handleLogout, isLoading]);

  return (
    <div className="flex h-full flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold">Logging out...</h1>
      <p>Please wait...</p>
      <p>You will be redirected shortly.</p>
      <p>If not, please click the button below.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
