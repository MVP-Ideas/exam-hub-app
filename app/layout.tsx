'use client';

import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/providers';
import { Toaster } from '@/components/ui/sonner';

const dmSans = DM_Sans({
	variable: '--font-dm-sans',
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${dmSans.variable} antialiased`}>
				<Providers>{children}</Providers>
				<Toaster />
			</body>
		</html>
	);
}
