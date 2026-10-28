import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Collection } from "@/types/collection";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/app/collections/${collection.id}`} className="group block">
      <Card className="overflow-hidden p-0 transition-colors group-hover:border-primary">
        <div className="relative h-20 bg-gradient-to-br from-primary/30 via-accent to-card">
          {collection.isNew && (
            <Badge className="absolute right-3 top-3">New</Badge>
          )}
        </div>
        <CardContent className="space-y-1 p-4">
          <h3 className="font-medium leading-snug">{collection.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{collection.hint}</p>
          <p className="pt-1 text-xs text-muted-foreground">
            {collection.examples.length} examples · Free
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}