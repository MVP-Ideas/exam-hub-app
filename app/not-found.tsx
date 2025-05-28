import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <ExclamationTriangleIcon className="size-24 text-red-500" />
        <h1 className="text-xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-sm">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-xl"
        >
          <Button variant="default">Go back to the home page</Button>
        </Link>
      </div>
    </div>
  );
}
