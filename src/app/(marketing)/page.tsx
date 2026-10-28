import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">
        Stop guessing what to post.
      </h1>
      <p className="text-lg text-muted-foreground">
        Track top channels, find outlier videos, understand why they went viral,
        and turn the pattern into your own script, in under 10 minutes.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/signup">Try It Free</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/pricing">See pricing</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/collections">Browse Collections</Link>
        </Button>
      </div>
    </section>
  );
}