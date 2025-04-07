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
		if (!isAuthenticated && !isLoading && pathName !== '/login') {
			router.replace('/login');
		}
	}, [isAuthenticated, isLoading, router, pathName]);

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center">
				<BeatLoader />
			</div>
		);
	}

	return <>{children}</>;
}
