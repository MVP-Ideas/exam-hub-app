"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks";

export default function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { verifyToken } = useAuth();

  useEffect(() => {
    const verify = async () => {
      await verifyToken();
    };

    verify();
  }, []);

  return <>{children}</>;
}
