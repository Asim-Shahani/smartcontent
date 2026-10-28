import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, ProjectItem, ProjectItemKind } from "@/types/project";

function today() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const same = (a: ProjectItem, kind: ProjectItemKind, refId: string) =>
  a.kind === kind && a.refId === refId;

type ProjectsState = {
  projects: Project[];
  create: (name: string) => string;
  addItem: (projectId: string, item: ProjectItem) => void;
  removeItem: (projectId: string, kind: ProjectItemKind, refId: string) => void;
  moveItem: (fromId: string, toId: string, item: ProjectItem) => void;
};

export const useProjects = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],
      create: (name) => {
        const id = `p_${Date.now()}`;
        set((st) => ({
          projects: [
            { id, name: name.trim() || "Untitled project", createdLabel: today(), items: [] },
            ...st.projects,
          ],
        }));
        return id;
      },
      addItem: (projectId, item) =>
        set((st) => ({
          projects: st.projects.map((p) =>
            p.id === projectId && !p.items.some((i) => same(i, item.kind, item.refId))
              ? { ...p, items: [item, ...p.items] }
              : p
          ),
        })),
      removeItem: (projectId, kind, refId) =>
        set((st) => ({
          projects: st.projects.map((p) =>
            p.id === projectId
              ? { ...p, items: p.items.filter((i) => !same(i, kind, refId)) }
              : p
          ),
        })),
      // PRD FR-PROJ-03: move assets between projects
      moveItem: (fromId, toId, item) =>
        set((st) => ({
          projects: st.projects.map((p) => {
            if (p.id === fromId)
              return { ...p, items: p.items.filter((i) => !same(i, item.kind, item.refId)) };
            if (p.id === toId && !p.items.some((i) => same(i, item.kind, item.refId)))
              return { ...p, items: [item, ...p.items] };
            return p;
          }),
        })),
    }),
    { name: "smartcontent-projects", skipHydration: true }
  )
);