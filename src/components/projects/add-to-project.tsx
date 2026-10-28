"use client";

import { useState } from "react";
import { Check, FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/store/projects";
import type { ProjectItem } from "@/types/project";

type Props = {
  item: ProjectItem;
  size?: "default" | "sm";
};

export function AddToProject({ item, size = "default" }: Props) {
  const projects = useProjects((s) => s.projects);
  const create = useProjects((s) => s.create);
  const addItem = useProjects((s) => s.addItem);
  const removeItem = useProjects((s) => s.removeItem);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const isIn = (p: (typeof projects)[number]) =>
    p.items.some((i) => i.kind === item.kind && i.refId === item.refId);
  const inAny = projects.some(isIn);

  function createAndAdd() {
    const id = create(name);
    addItem(id, item);
    setName("");
    setOpen(false);
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={inAny ? "secondary" : "outline"} size={size}>
            <FolderPlus className="size-4" />
            {inAny ? "In a project" : "Add to project"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {projects.length === 0 && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">No projects yet</p>
          )}
          {projects.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onSelect={() =>
                isIn(p) ? removeItem(p.id, item.kind, item.refId) : addItem(p.id, item)
              }
            >
              <span className="flex-1 truncate">{p.name}</span>
              {isIn(p) && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            <Plus className="size-4" /> New project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Name it and this item is added straight away.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="e.g. October fitness series"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createAndAdd();
            }}
          />
          <DialogFooter>
            <Button onClick={createAndAdd}>Create and add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}