import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryMeta, collections } from "@/mocks/collections";

export default function CollectionsLandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-6 py-16">
      <section className="space-y-4 text-center">
        <Badge variant="secondary">Free on every plan</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {collections.length} proven video patterns. Free.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Formats, editing styles, visual hooks and signature series, each with a full
          breakdown, example videos and a transcript. No credits, no card, new videos every
          week.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Browse the library free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryMeta.map((m) => {
          const items = collections.filter((c) => c.category === m.value);
          return (
            <Card key={m.value}>
              <CardContent className="space-y-3 p-5">
                <div>
                  <p className="text-3xl font-semibold">{items.length}</p>
                  <h2 className="font-medium">{m.label}</h2>
                  <p className="text-sm text-muted-foreground">{m.blurb}</p>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {items.slice(0, 4).map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                  <li>and {items.length - 4} more</li>
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Study it. Export it. Use it.</h2>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Every collection exports as a reference sheet you can hand to your editor or paste
          into your script.
        </p>
        <Button asChild>
          <Link href="/signup">Try It Free</Link>
        </Button>
      </section>
    </div>
  );
}