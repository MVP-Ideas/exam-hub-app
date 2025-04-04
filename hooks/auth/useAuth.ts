'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useAuthStore } from '@/stores/auth-store';

const useAuth = () => {
	const isAuthenticatedB2C = useIsAuthenticated();
	const { inProgress } = useMsal();
	const { accessToken } = useAuthStore();

	const router = useRouter();
	const pathName = usePathname();

	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticatedLocal = !!accessToken;
	const isAuthenticated = isAuthenticatedB2C || isAuthenticatedLocal;

	useEffect(() => {
		if (inProgress !== 'none') return;

		// Not authenticated → force login if not already there
		if (!isAuthenticated) {
			if (pathName !== '/login' && pathName !== '/sign-up') {
				router.push('/login');
			}
		}
		// Already authenticated → prevent access to login/signup
		else {
			if (pathName === '/login' || pathName === '/sign-up') {
				router.push('/');
			}
		}

		setIsLoading(false);
	}, [isAuthenticated, inProgress, pathName, router]);

	return { isLoading };
};

export default useAuth;