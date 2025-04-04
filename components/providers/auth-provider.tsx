'use client';

import useAuth from '@/hooks/auth/useAuth';
import { BeatLoader } from 'react-spinners';

export default function AuthenticationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center">
				<BeatLoader />
			</div>
		);
	}

	return <>{children}</>;
}
