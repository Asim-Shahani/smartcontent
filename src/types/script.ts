export type ScriptBlockKey =
  | "hook"
  | "introduction"
  | "main"
  | "storyFlow"
  | "cta"
  | "ending";

export type ScriptBlocks = Record<ScriptBlockKey, string>;

export type Script = {
  id: string;
  title: string;
  sourceVideoId: string;
  version: number;
  expanded: boolean;
  updatedLabel: string;
  blocks: ScriptBlocks;
};