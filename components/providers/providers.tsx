import { MsalProviderApp } from "./msal-provider-app";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { UserStoreProvider } from "./user-store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MsalProviderApp>
      <ThemeProvider>
        <QueryProvider>
          <UserStoreProvider>{children}</UserStoreProvider>
        </QueryProvider>
      </ThemeProvider>
    </MsalProviderApp>
  );
}
