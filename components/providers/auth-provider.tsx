'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '@/hooks';

const PUBLIC_ROUTES = ['/login', '/signup'];

export default function AuthenticationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathName = usePathname();
	const router = useRouter();
	const { isAuthenticated, isFetched } = useAuth();

	useEffect(() => {
		if (!isFetched) return;

		if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathName)) {
			router.replace('/login');
		}
	}, [isAuthenticated, isFetched, pathName, router]);

	if (!isFetched) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<BeatLoader />
			</div>
		);
	}

	return <>{children}</>;
}
