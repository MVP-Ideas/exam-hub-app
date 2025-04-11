import { MsalProviderApp } from './msal-provider-app';
import QueryProvider from './query-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<MsalProviderApp>
			<ThemeProvider>
				<QueryProvider>{children}</QueryProvider>
			</ThemeProvider>
		</MsalProviderApp>
	);
}
