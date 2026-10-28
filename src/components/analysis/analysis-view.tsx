"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  FolderPlus,
  Lightbulb,
  Loader2,
  PenLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCount } from "@/components/discover/video-card";
import { videos } from "@/mocks/videos";
import { analysisToLlmText, buildAnalysis } from "@/mocks/analysis";
import { buildScript } from "@/mocks/script-builder";
import { useCredits } from "@/store/credits";
import { useScripts } from "@/store/scripts";
import { buildIdea } from "@/mocks/idea-builder";
import { useIdeas } from "@/store/ideas";
import { AddToProject } from "@/components/projects/add-to-project";

type Status = "idle" | "queued" | "processing" | "complete";

export function AnalysisView({ videoId }: { videoId: string }) {
  const video = videos.find((v) => v.id === videoId);

  // ---- all hooks first (before any early return) ----
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  const [copied, setCopied] = useState(false);

  const balance = useCredits((s) => s.balance);
  const charged = useCredits((s) => s.charged);
  const consume = useCredits((s) => s.consume);
  const addScript = useScripts((s) => s.add);
    const addIdea = useIdeas((s) => s.add);
  const toggleShortlist = useIdeas((s) => s.toggleShortlist);
  const ideaShortlisted = useIdeas((s) =>
    s.ideas.some((i) => i.id === `idea_${videoId}` && i.shortlisted)
  );

  const alreadyAnalyzed = charged.includes(`analyze:${videoId}`);
  const outOfCredits = balance <= 0 && !alreadyAnalyzed;

  useEffect(() => {
    if (status === "queued") {
      const t = setTimeout(() => setStatus("processing"), 1200);
      return () => clearTimeout(t);
    }
    if (status === "processing") {
      const t = setTimeout(() => {
        consume(`analyze:${videoId}`); // charged only on successful completion
        setStatus("complete");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [status, consume, videoId]);

    // Ideas are generated automatically after analysis, with no extra credit (PRD)
  useEffect(() => {
    if (status === "complete" && video) {
      addIdea(buildIdea(video, buildAnalysis(video)));
    }
  }, [status, video, addIdea]);

  // ---- early return ----
  if (!video) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Video not found.</p>
        <Button asChild variant="outline">
          <Link href="/app/discover">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  const analysis = buildAnalysis(video);

  async function copyForLlm() {
    if (!video) return;
    await navigator.clipboard.writeText(analysisToLlmText(video, analysis));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function createScript() {
    if (!video) return;
    const id = `s_${Date.now()}`;
    if (!consume(`script:${id}`)) return; // blocked when credits are exhausted
    addScript({
      id,
      title: analysis.idea.title,
      sourceVideoId: video.id,
      version: 1,
      expanded: false,
      blocks: buildScript(video, analysis),
    });
    router.push(`/app/scripts/${id}`);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/app/discover"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to Discover
      </Link>

      {/* Header: preview + stats */}
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="aspect-[9/12] rounded-lg bg-gradient-to-br from-primary/30 via-accent to-card" />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{video.platform}</Badge>
              <Badge>{video.outlierScore.toFixed(1)}x outlier</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{video.title}</h1>
            <p className="text-sm text-muted-foreground">
              {video.creator} · {video.postedLabel}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Views", formatCount(video.views)],
              ["Engagement", `${video.engagement}%`],
              ["Outlier score", `${video.outlierScore.toFixed(1)}x`],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {status === "complete" && (
            <div className="flex flex-wrap gap-2">
              <Button onClick={createScript} disabled={balance <= 0}>
                <PenLine className="size-4" /> Create script · 1 credit
              </Button>
                <Button
                variant={ideaShortlisted ? "secondary" : "outline"}
                onClick={() => toggleShortlist(`idea_${video.id}`)}
              >
                <Lightbulb className="size-4" />
                {ideaShortlisted ? "Shortlisted" : "Shortlist idea"}
              </Button>
                           <AddToProject
                item={{ kind: "video", refId: video.id, title: video.title }}
              />
              <Button variant="outline" onClick={copyForLlm}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Export for LLM"}
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/app/discover/${video.id}`} target="_blank">
                  <ExternalLink className="size-4" /> Open in new tab
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Analysis state */}
      {status === "idle" && outOfCredits && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="font-medium">Credits exhausted</p>
            <p className="text-sm text-muted-foreground">
              You&apos;ve used all 100 credits for this month. Billing coming soon.
              You can still browse Discover and Collections, and credits reset next month.
            </p>
            <Button asChild variant="outline">
              <Link href="/app/collections">Browse Collections</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "idle" && !outOfCredits && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="font-medium">Analyze this video</p>
              <p className="text-sm text-muted-foreground">
                {alreadyAnalyzed
                  ? "Already analyzed: opening it again is free."
                  : "Costs 1 credit. Credits are only deducted when the analysis completes."}
              </p>
            </div>
            <Button onClick={() => setStatus("queued")}>
              {alreadyAnalyzed ? "View analysis · free" : "Analyze · 1 credit"}
            </Button>
          </CardContent>
        </Card>
      )}

      {(status === "queued" || status === "processing") && (
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Loader2 className="size-5 animate-spin text-primary" />
            <div>
              <p className="font-medium">
                {status === "queued" ? "Queued" : "Processing"}
              </p>
              <p className="text-sm text-muted-foreground">
                {status === "queued"
                  ? "Waiting for a worker..."
                  : "Extracting transcript, hook and structure..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "complete" && (
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="caption">Caption</TabsTrigger>
            <TabsTrigger value="idea">Idea</TabsTrigger>
            <TabsTrigger value="hook">Hook</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardContent className="p-6 text-sm leading-relaxed">
                {analysis.summary}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card>
              <CardContent className="space-y-2 p-6 text-sm">
                {analysis.transcript.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="caption">
            <Card>
              <CardContent className="p-6 text-sm">{analysis.caption}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="idea">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <p className="text-lg font-medium">{analysis.idea.title}</p>
                <p>
                  <span className="text-muted-foreground">Positioning: </span>
                  {analysis.idea.positioning}
                </p>
                <p>
                  <span className="text-muted-foreground">Contrast: </span>
                  {analysis.idea.contrast}
                </p>
                <p>
                  <span className="text-muted-foreground">Make it yours: </span>
                  {analysis.idea.personalization}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hook">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <p className="text-lg font-medium">&ldquo;{analysis.hook.line}&rdquo;</p>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {analysis.hook.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="format">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <p className="text-lg font-medium">{analysis.format.type}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {analysis.format.structure.map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      <Badge variant="secondary">{s}</Badge>
                      {i < analysis.format.structure.length - 1 && (
                        <span className="text-muted-foreground">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <Card>
              <CardContent className="p-6 text-sm">
                <ul className="list-disc space-y-1 pl-5">
                  {analysis.visual.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}