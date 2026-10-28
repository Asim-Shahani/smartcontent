"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProjects } from "@/store/projects";

export default function ProjectsPage() {
  const ready = useHydrated(useProjects);
  const projects = useProjects((s) => s.projects);
  const create = useProjects((s) => s.create);
  const [name, setName] = useState("");

  function onCreate() {
    create(name);
    setName("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Group videos, ideas and scripts by campaign or client.
        </p>
      </div>

      <div className="flex max-w-md gap-2">
        <Input
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCreate();
          }}
        />
        <Button onClick={onCreate}>Create project</Button>
      </div>

      {!ready ? null : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground">
            Create one above, or use &quot;Add to project&quot; on any video, idea or script.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const count = (k: string) => p.items.filter((i) => i.kind === k).length;
            return (
              <Link key={p.id} href={`/app/projects/${p.id}`}>
                <Card className="transition-colors hover:border-primary">
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="size-4 text-primary" />
                      <h3 className="truncate font-medium">{p.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {count("video")} videos · {count("idea")} ideas · {count("script")} scripts
                    </p>
                    <p className="text-xs text-muted-foreground">Created {p.createdLabel}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}