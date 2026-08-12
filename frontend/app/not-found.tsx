import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Gamepad2 className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-foreground">404</h1>
          <p className="text-xl font-semibold text-foreground mt-2">Page not found</p>
          <p className="text-muted-foreground mt-2 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
