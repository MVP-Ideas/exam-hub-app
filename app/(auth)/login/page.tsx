'use client';

import { LoginForm } from '@/components/auth/login-form';
import { MsalSignInButton } from '@/components/auth/msal-sign-in-button';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="min-h-svh flex flex-col w-full items-center justify-center p-6 md:p-10">
			<div className="flex flex-col gap-3 w-full max-w-sm">
				<LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
				<div className="flex flex-row items-center justify-center gap-2">
					<div className="h-px bg-muted w-full border" />
					<p className="text-muted-foreground text-center text-xs">or</p>
					<div className="h-px bg-muted w-full border" />
				</div>
				<div className="flex flex-col gap-6">
					<MsalSignInButton isLoading={isLoading} setIsLoading={setIsLoading} />
					<div className="flex items-center justify-center">
						<p className="text-muted-foreground text-center text-xs">
							Don&apos;t have an account?{' '}
							<Link
								href="/sign-up"
								className="text-primary hover:text-primary/80 hover:underline"
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
