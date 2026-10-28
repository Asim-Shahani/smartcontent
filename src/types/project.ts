export type ProjectItemKind = "video" | "idea" | "script";

export type ProjectItem = {
  kind: ProjectItemKind;
  refId: string;
  title: string;
};

export type Project = {
  id: string;
  name: string;
  createdLabel: string;
  items: ProjectItem[];
};