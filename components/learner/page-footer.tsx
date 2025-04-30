import Link from "next/link";

export default function PageFooter() {
  return (
    <footer className="border-muted border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-y-4 lg:justify-between">
          <div className="text-muted-foreground flex space-x-4 text-sm">
            <Link href="#" className="hover:text-foreground">
              Help Center
            </Link>
            <Link href="#" className="hover:text-foreground">
              Study Resources
            </Link>
            <Link href="#" className="hover:text-foreground">
              Feedback
            </Link>
            <Link href="#" className="hover:text-foreground">
              Account Settings
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2025 Exam Hub, Level Up Your Data. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
