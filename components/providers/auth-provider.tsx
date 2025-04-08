'use client';

import { useAuth } from '@/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

export default function AuthenticationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathName = usePathname();
	const { isLoading, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isAuthenticated && !['/login', '/signup'].includes(pathName)) {
			router.replace('/login');
		}
		if (isAuthenticated && ['/login', '/signup'].includes(pathName)) {
			// If the user is authenticated and tries to access the login or sign-up page, redirect them to the home page
			router.replace('/');
		}
	}, [isAuthenticated, pathName, router]);

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center">
				<BeatLoader />
			</div>
		);
	}

	return <>{children}</>;
}
