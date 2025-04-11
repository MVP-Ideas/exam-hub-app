import AuthenticationProvider from '@/components/providers/auth-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthenticationProvider>
			<div className="flex flex-col items-center justify-center bg-background">
				{children}
			</div>
		</AuthenticationProvider>
	);
}
