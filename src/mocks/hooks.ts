import type { Hook, HookCategory } from "@/types/hook";

export const hookCategories: { value: HookCategory; label: string }[] = [
  { value: "contrarian", label: "Contrarian statement" },
  { value: "curiosity", label: "Curiosity gap" },
  { value: "question", label: "Question hook" },
  { value: "unexpected", label: "Unexpected claim" },
  { value: "problem", label: "Problem statement" },
];

export const categoryLabel = Object.fromEntries(
  hookCategories.map((c) => [c.value, c.label])
) as Record<HookCategory, string>;

export const hookLibrary: Hook[] = [
  { id: "h1", text: "Most people get this completely wrong, and I did too", category: "contrarian", niche: "Productivity" },
  { id: "h2", text: "Stop stretching before your workout. Do this instead", category: "contrarian", niche: "Fitness" },
  { id: "h3", text: "Meal prep on Sunday is a waste of time", category: "contrarian", niche: "Food" },
  { id: "h4", text: "Budgeting apps are making you broke", category: "contrarian", niche: "Finance" },
  { id: "h5", text: "The one setting on your phone that changes everything", category: "curiosity", niche: "Tech" },
  { id: "h6", text: "I found the hidden reason your videos stop at 3 seconds", category: "curiosity", niche: "Content" },
  { id: "h7", text: "What happens to your body when you walk 10k steps for 30 days", category: "curiosity", niche: "Fitness" },
  { id: "h8", text: "There's a reason nobody shows you this part of the recipe", category: "curiosity", niche: "Food" },
  { id: "h9", text: "Why do your best videos always flop?", category: "question", niche: "Content" },
  { id: "h10", text: "What if you only needed one tool to run your whole business?", category: "question", niche: "Tech" },
  { id: "h11", text: "Are you making this mistake with your savings?", category: "question", niche: "Finance" },
  { id: "h12", text: "How do top creators write a hook in under 60 seconds?", category: "question", niche: "Content" },
  { id: "h13", text: "I woke up at 5am for 30 days and my income doubled", category: "unexpected", niche: "Productivity" },
  { id: "h14", text: "This $12 gadget replaced my entire desk setup", category: "unexpected", niche: "Tech" },
  { id: "h15", text: "I ate the same meal for a month and this is what changed", category: "unexpected", niche: "Food" },
  { id: "h16", text: "One tiny edit doubled my watch time", category: "unexpected", niche: "Content" },
  { id: "h17", text: "If you can't stay consistent at the gym, watch this", category: "problem", niche: "Fitness" },
  { id: "h18", text: "You're wasting hours editing and here's why", category: "problem", niche: "Content" },
  { id: "h19", text: "Tired of ending every month with no money left?", category: "problem", niche: "Finance" },
  { id: "h20", text: "If your to-do list never gets done, this is the reason", category: "problem", niche: "Productivity" },
];

const templates: Record<HookCategory, string[]> = {
  contrarian: [
    "Everything you've been told about {topic} is wrong",
    "Stop {topic}. Do this instead",
    "{topic} is overrated, and here's why",
    "Unpopular opinion: you don't need {topic}",
    "The advice on {topic} that's keeping you stuck",
  ],
  curiosity: [
    "The one thing about {topic} nobody explains",
    "I found the hidden reason {topic} works",
    "What happens when you try {topic} for 30 days",
    "There's a secret behind {topic} most people miss",
    "Here's what the experts won't tell you about {topic}",
  ],
  question: [
    "Why does everyone get {topic} wrong?",
    "What if {topic} was the easiest part?",
    "Are you making this mistake with {topic}?",
    "How do the top creators approach {topic}?",
    "Do you actually need {topic}?",
  ],
  unexpected: [
    "{topic} changed my life in 7 days",
    "I tried {topic} every day and the result shocked me",
    "{topic} is the cheapest upgrade nobody uses",
    "One tiny change to {topic} doubled my results",
    "This {topic} trick sounds fake but it works",
  ],
  problem: [
    "If {topic} feels impossible, watch this",
    "Struggling with {topic}? This is why",
    "You're wasting hours on {topic}",
    "The real reason {topic} isn't working for you",
    "Tired of {topic} going nowhere?",
  ],
};

const suffixes = ["", " (watch to the end)", " in 2026", " for beginners"];

// 5 templates x 4 variations = 20 hooks per request (PRD asks for at least 10)
export function generateHooks(topic: string, category: HookCategory): Hook[] {
  const t = topic.trim() || "your niche";
  return templates[category].flatMap((tpl) =>
    suffixes.map((s) => {
      const base = tpl.replace("{topic}", t);
      const end = base.endsWith("?") ? "?" : "";
      const core = end ? base.slice(0, -1) : base;
      const text = core + s + end;
      return { id: text, text, category, niche: t };
    })
  );
}