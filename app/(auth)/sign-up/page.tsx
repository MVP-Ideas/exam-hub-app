'use client';

import { MsalSignInButton } from '@/components/auth/msal-sign-in-button';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { useCheckAuthenticated } from '@/hooks';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
	useCheckAuthenticated();

	const [isLoading, setIsLoading] = useState(false);
	return (
		<div className="min-h-svh flex flex-row gap-10 w-full items-center justify-center p-6 md:p-10 lg:p-14">
			<div className="hidden md:flex flex-row gap-3 w-full h-full md:w-1/2 items-center justify-center max-w-sm">
				<div className="w-full p-10 items-center justify-center flex">
					<Image
						src={'/sign-up/hero.svg'}
						alt="Login Hero"
						width={400}
						height={400}
						className="object-contain"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-3 w-full max-w-sm md:w-1/2 md:max-w-lg bg-background rounded-lg p-10 shadow-md">
				<SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
				<div className="flex items-center justify-center">
					<p className="text-muted-foreground text-center text-sm under">
						Already have an account?{' '}
						<Link
							href="/login"
							className="text-primary hover:text-primary/80 underline"
						>
							Sign in
						</Link>
					</p>
				</div>
				<div className="flex flex-row items-center justify-center gap-2">
					<div className="h-px bg-muted w-full border" />
					<p className="text-muted-foreground text-center text-xs">or</p>
					<div className="h-px bg-muted w-full border" />
				</div>
				<div className="flex flex-col gap-2">
					<MsalSignInButton
						image="/sign-up/facebook.svg"
						providerUrl={'facebook'}
						text="Sign up with Facebook"
						disabled={isLoading}
						setDisabled={setIsLoading}
					/>
					<MsalSignInButton
						image="/sign-up/google.svg"
						providerUrl={'google'}
						text="Sign up with Google"
						disabled={isLoading}
						setDisabled={setIsLoading}
					/>
					<MsalSignInButton
						image="/sign-up/linkedin.svg"
						providerUrl={'linkedin'}
						text="Sign up with LinkedIn"
						disabled={isLoading}
						setDisabled={setIsLoading}
					/>
				</div>
			</div>
		</div>
	);
}
