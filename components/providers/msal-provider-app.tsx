import { getMsalInstance } from '@/config/auth-config';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

export function MsalProviderApp({ children }: { children: React.ReactNode }) {
	const [msalInstance, setMsalInstance] =
		useState<PublicClientApplication | null>(null);

	useEffect(() => {
		const init = async () => {
			const instance = await getMsalInstance();
			setMsalInstance(instance);
		};

		init();
	}, []);

	if (!msalInstance) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<BeatLoader />
			</div>
		);
	}

	return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
