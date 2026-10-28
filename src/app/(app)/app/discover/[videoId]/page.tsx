import { Suspense } from "react";
import { AnalysisView } from "@/components/analysis/analysis-view";

async function Content({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  return <AnalysisView videoId={videoId} />;
}

export default function VideoAnalysisPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <Content params={params} />
    </Suspense>
  );
}