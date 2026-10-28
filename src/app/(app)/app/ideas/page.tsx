"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lightbulb, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/components/discover/video-card";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildAnalysis } from "@/mocks/analysis";
import { buildScript } from "@/mocks/script-builder";
import { videos } from "@/mocks/videos";
import { useCredits } from "@/store/credits";
import { useIdeas } from "@/store/ideas";
import { useScripts } from "@/store/scripts";
import type { Idea } from "@/types/idea";
import { AddToProject } from "@/components/projects/add-to-project";

export default function IdeasPage() {
  const router = useRouter();
  const ready = useHydrated(useIdeas);
  const ideas = useIdeas((s) => s.ideas);
  const toggleShortlist = useIdeas((s) => s.toggleShortlist);
  const balance = useCredits((s) => s.balance);
  const consume = useCredits((s) => s.consume);
  const addScript = useScripts((s) => s.add);
  const [tab, setTab] = useState<"all" | "shortlisted">("all");

  const shown = tab === "all" ? ideas : ideas.filter((i) => i.shortlisted);

  // Converting an idea to a script carries the idea context into the script writer
  function createScript(idea: Idea) {
    const video = videos.find((v) => v.id === idea.sourceVideoId);
    if (!video) return;
    const id = `s_${Date.now()}`;
    if (!consume(`script:${id}`)) return;
    addScript({
      id,
      title: idea.title,
      sourceVideoId: video.id,
      version: 1,
      expanded: false,
      blocks: buildScript(video, buildAnalysis(video)),
    });
    router.push(`/app/scripts/${id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ideas</h1>
        <p className="text-sm text-muted-foreground">
          Ideas are generated automatically when you analyze a video. No extra credit.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={tab === "all" ? "default" : "outline"}
          onClick={() => setTab("all")}
        >
          All ({ideas.length})
        </Button>
        <Button
          size="sm"
          variant={tab === "shortlisted" ? "default" : "outline"}
          onClick={() => setTab("shortlisted")}
        >
          Shortlisted ({ideas.filter((i) => i.shortlisted).length})
        </Button>
      </div>

      {!ready ? null : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">
            {tab === "all" ? "No ideas yet" : "Nothing shortlisted yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {tab === "all"
              ? "Analyze a video in Discover and its idea will appear here."
              : "Open the All tab and shortlist the ideas you like."}
          </p>
          <Button asChild>
            <Link href="/app/discover">Go to Discover</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((idea) => (
            <Card key={idea.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium leading-snug">{idea.title}</h3>
                  <Badge variant="secondary">{idea.format}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  From{" "}
                  <Link
                    href={`/app/discover/${idea.sourceVideoId}`}
                    className="underline hover:text-foreground"
                  >
                    {idea.creator}
                  </Link>{" "}
                  · {formatCount(idea.views)} views · {idea.engagement}% engagement
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Positioning: </span>
                    {idea.positioning}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Contrast: </span>
                    {idea.contrast}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Make it yours: </span>
                    {idea.personalization}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant={idea.shortlisted ? "secondary" : "outline"}
                    onClick={() => toggleShortlist(idea.id)}
                  >
                    <Lightbulb className="size-4" />
                    {idea.shortlisted ? "Shortlisted" : "Shortlist"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => createScript(idea)}
                    disabled={balance <= 0}
                  >
                    <PenLine className="size-4" /> Create script · 1 credit
                  </Button>
                                    <AddToProject
                    size="sm"
                    item={{ kind: "idea", refId: idea.id, title: idea.title }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}