interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="from-primary h-screen w-screen bg-linear-to-r to-indigo-500">
      {children}
    </main>
  );
}
