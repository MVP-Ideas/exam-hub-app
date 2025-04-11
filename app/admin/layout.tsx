import AdminProvider from '@/components/providers/admin-provider';
import AuthenticationProvider from '@/components/providers/auth-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthenticationProvider>
			<AdminProvider>
				<main className="bg-accent min-h-screen">{children}</main>
			</AdminProvider>
		</AuthenticationProvider>
	);
}
