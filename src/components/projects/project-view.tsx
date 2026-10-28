"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Lightbulb,
  MoveRight,
  Trash2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProjects } from "@/store/projects";
import type { ProjectItem, ProjectItemKind } from "@/types/project";

const groups: { kind: ProjectItemKind; label: string; icon: LucideIcon }[] = [
  { kind: "video", label: "Videos", icon: Video },
  { kind: "idea", label: "Ideas", icon: Lightbulb },
  { kind: "script", label: "Scripts", icon: FileText },
];

function hrefFor(item: ProjectItem) {
  if (item.kind === "video") return `/app/discover/${item.refId}`;
  if (item.kind === "script") return `/app/scripts/${item.refId}`;
  return "/app/ideas";
}

export function ProjectView({ projectId }: { projectId: string }) {
  const ready = useHydrated(useProjects);
  const projects = useProjects((s) => s.projects);
  const removeItem = useProjects((s) => s.removeItem);
  const moveItem = useProjects((s) => s.moveItem);

  const project = projects.find((p) => p.id === projectId);
  const others = projects.filter((p) => p.id !== projectId);

  if (!ready) return <p className="text-sm text-muted-foreground">Loading...</p>;

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Project not found.</p>
        <Button asChild variant="outline">
          <Link href="/app/projects">Back to projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/app/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-sm text-muted-foreground">
          {project.items.length} linked assets · created {project.createdLabel}
        </p>
      </div>

      {project.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">This project is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use &quot;Add to project&quot; on a video, idea or script to collect it here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/app/discover">Go to Discover</Link>
          </Button>
        </div>
      ) : (
        groups.map((g) => {
          const items = project.items.filter((i) => i.kind === g.kind);
          if (items.length === 0) return null;
          const Icon = g.icon;
          return (
            <section key={g.kind} className="space-y-2">
              <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="size-4" /> {g.label} ({items.length})
              </h2>
              {items.map((item) => (
                <Card key={`${item.kind}-${item.refId}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Link
                      href={hrefFor(item)}
                      className="flex-1 truncate text-sm font-medium hover:underline"
                    >
                      {item.title}
                    </Link>

                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoveRight className="size-4" /> Move
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Move to</DropdownMenuLabel>
                        {others.length === 0 && (
                          <p className="px-2 py-1.5 text-xs text-muted-foreground">
                            No other projects yet
                          </p>
                        )}
                        {others.map((o) => (
                          <DropdownMenuItem
                            key={o.id}
                            onSelect={() => moveItem(project.id, o.id, item)}
                          >
                            <span className="truncate">{o.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remove from project"
                      onClick={() => removeItem(project.id, item.kind, item.refId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}