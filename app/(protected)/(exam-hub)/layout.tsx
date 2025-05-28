import AuthenticationProvider from "@/components/providers/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
}
