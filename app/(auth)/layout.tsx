interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className="h-screen w-screen bg-linear-to-r from-primary to-primary/50">
			{children}
		</main>
	);
}
