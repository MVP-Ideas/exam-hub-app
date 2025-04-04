'use client';

import { MsalSignInButton } from '@/components/auth/msal-sign-in-button';
import { SignUpForm } from '@/components/auth/sign-up-form';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
	const [isLoading, setIsLoading] = useState(false);
	return (
		<div className="min-h-svh flex flex-col w-full items-center justify-center p-6 md:p-10">
			<div className="flex flex-col gap-3 w-full max-w-sm">
				<SignUpForm 
					isLoading={isLoading}
					setIsLoading={setIsLoading}
				/>
				<div className="flex flex-row items-center justify-center gap-2">
					<div className="h-px bg-muted w-full border" />
					<p className="text-muted-foreground text-center text-xs">or</p>
					<div className="h-px bg-muted w-full border" />
				</div>
				<div className="flex flex-col gap-6">
					<MsalSignInButton isLoading={isLoading} setIsLoading={setIsLoading} />
					<div className="flex items-center justify-center">
						<p className="text-muted-foreground text-center text-xs">
							Already have an account?{' '}
							<Link
								href="/login"
								className="text-primary hover:text-primary/80 hover:underline"
							>
								Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
