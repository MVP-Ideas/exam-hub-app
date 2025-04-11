'use client';

import { LoginForm } from '@/components/auth/login-form';
import { MsalSignInButton } from '@/components/auth/msal-sign-in-button';
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
						src={'/login/hero.svg'}
						alt="Login Hero"
						width={400}
						height={400}
						className="object-contain"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-3 w-full max-w-sm md:w-1/2 md:max-w-lg bg-background rounded-lg p-10 shadow-md">
				<LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
				<div className="flex items-center justify-center">
					<p className="text-muted-foreground text-center text-sm under">
						Don&apos;t have an account?{' '}
						<Link
							href="/sign-up"
							className="text-primary hover:text-primary/80 underline"
						>
							Sign up
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
						image="/login/facebook.svg"
						providerUrl={'facebook'}
						text="Login with Facebook"
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
					<MsalSignInButton
						image="/login/google.svg"
						providerUrl={'google'}
						text="Login with Google"
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
					<MsalSignInButton
						image="/login/linkedin.svg"
						providerUrl={'linkedin'}
						text="Login with LinkedIn"
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
				</div>
			</div>
		</div>
	);
}
