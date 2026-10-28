export type HookCategory =
  | "contrarian"
  | "curiosity"
  | "question"
  | "unexpected"
  | "problem";

export type Hook = {
  id: string;
  text: string;
  category: HookCategory;
  niche: string;
};