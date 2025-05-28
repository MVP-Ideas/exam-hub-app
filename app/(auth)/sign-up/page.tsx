"use client";

import { MsalSignInButton } from "@/components/auth/msal-sign-in-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useCheckAuthenticated } from "@/hooks";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
  redirect("/login");
  useCheckAuthenticated();

  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex min-h-svh w-full flex-row items-center justify-center gap-10 p-6 md:p-10 lg:p-14">
      <div className="hidden h-full w-full max-w-sm flex-row items-center justify-center gap-3 md:flex md:w-1/2">
        <div className="flex w-full items-center justify-center p-10">
          <Image
            src={"/sign-up/hero.svg"}
            alt="Login Hero"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
      <div className="bg-background flex w-full max-w-sm flex-col gap-3 rounded-lg p-10 shadow-md md:w-1/2 md:max-w-lg">
        <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground under text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="bg-muted h-px w-full border" />
          <p className="text-muted-foreground text-center text-xs">or</p>
          <div className="bg-muted h-px w-full border" />
        </div>
        <div className="flex flex-col gap-2">
          <MsalSignInButton
            image="/sign-up/facebook.svg"
            providerUrl={"facebook"}
            text="Sign up with Facebook"
            disabled={isLoading}
            setDisabled={setIsLoading}
          />
          <MsalSignInButton
            image="/sign-up/google.svg"
            providerUrl={"google"}
            text="Sign up with Google"
            disabled={isLoading}
            setDisabled={setIsLoading}
          />
          <MsalSignInButton
            image="/sign-up/linkedin.svg"
            providerUrl={"linkedin"}
            text="Sign up with LinkedIn"
            disabled={isLoading}
            setDisabled={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
}
