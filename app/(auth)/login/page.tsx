"use client";

import { MsalSignInButton } from "@/components/auth/msal-sign-in-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useCheckAuthenticated } from "@/hooks";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  useCheckAuthenticated();

  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="relative flex min-h-svh w-full flex-row items-center justify-center gap-10 p-6 md:p-10 lg:p-14">
      {/* Blur overlay */}
      <div className="bg-background/20 absolute"></div>

      {/* Main focused content */}
      <div className="bg-background relative z-10 flex w-full max-w-4xl flex-row items-center justify-center overflow-hidden rounded-xl shadow-xl">
        <div className="bg-primary hidden h-full w-full max-w-sm flex-row items-center justify-center gap-3 md:flex md:w-1/2">
          <div className="flex h-full w-full items-center justify-center">
            <Image
              src={"/login/hero.jpg"}
              alt="Login Hero"
              width={400}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <Card className="bg-background flex h-full w-full max-w-xs flex-1 flex-col gap-4 rounded-lg border-0 shadow-none md:w-1/2 md:max-w-lg">
          <CardHeader className="pb-0">
            <CardTitle className="text-center text-3xl font-bold">
              Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center text-lg">
              Choose your preferred login method
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 pt-4">
            <MsalSignInButton
              image="/login/facebook.svg"
              providerUrl="facebook"
              text="Login with Facebook"
              disabled={isLoading}
              setDisabled={setIsLoading}
            />
            <MsalSignInButton
              image="/login/google.svg"
              providerUrl="google"
              text="Login with Google"
              disabled={isLoading}
              setDisabled={setIsLoading}
            />
            <MsalSignInButton
              image="/login/microsoft.svg"
              providerUrl="microsoft"
              text="Login with Microsoft"
              disabled={isLoading}
              setDisabled={setIsLoading}
            />

            <div className="flex w-full justify-center gap-x-2 pt-4 text-center text-sm">
              <p className="text-muted-foreground">
                By continuing, you agree to our
                <a
                  href="/terms"
                  className="text-primary mx-1 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                and
                <a
                  href="/privacy"
                  className="text-primary mx-1 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
