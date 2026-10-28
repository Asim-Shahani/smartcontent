import { Suspense } from "react";
import { ScriptEditor } from "@/components/scripts/script-editor";

async function Content({ params }: { params: Promise<{ scriptId: string }> }) {
  const { scriptId } = await params;
  return <ScriptEditor scriptId={scriptId} />;
}

export default function ScriptPage({
  params,
}: {
  params: Promise<{ scriptId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <Content params={params} />
    </Suspense>
  );
}