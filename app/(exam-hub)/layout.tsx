export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
			{children}
		</div>
	);
}
