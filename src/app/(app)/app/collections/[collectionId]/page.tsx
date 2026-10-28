import { Suspense } from "react";
import { CollectionDetail } from "@/components/collections/collection-detail";

async function Content({ params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params;
  return <CollectionDetail collectionId={collectionId} />;
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <Content params={params} />
    </Suspense>
  );
}