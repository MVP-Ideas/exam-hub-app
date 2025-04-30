import RootLayout from "./root-layout";

export const metadata = {
  title: "Exam Hub",
  description: "A modern platform for managing and taking exams efficiently.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RootLayout>{children}</RootLayout>
    </html>
  );
}
