import AuthenticationProvider from "@/components/providers/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
}
