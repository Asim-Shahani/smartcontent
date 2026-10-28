import type { Video } from "@/types/video";

export type Analysis = {
  summary: string;
  transcript: string[];
  caption: string;
  idea: { title: string; positioning: string; contrast: string; personalization: string };
  hook: { line: string; reasons: string[] };
  format: { type: string; structure: string[] };
  visual: string[];
};

export function buildAnalysis(video: Video): Analysis {
  return {
    summary: `"${video.title}" by ${video.creator} performed ${video.outlierScore.toFixed(1)}x above the channel's own average. It works because it opens with a specific, believable claim, keeps the pacing tight, and closes with a payoff the viewer can reuse.`,
    transcript: [
      "[0:00] Most people get this completely wrong, and I did too.",
      "[0:04] Here is what actually changed the result for me.",
      "[0:12] First, I stopped doing the obvious thing everyone recommends.",
      "[0:21] Second, I measured one number every single day.",
      "[0:33] By the end, the difference was impossible to ignore.",
      "[0:41] Save this and try it for one week.",
    ],
    caption: `${video.title} - save this for later. #${video.niche.toLowerCase()} #shorts`,
    idea: {
      title: `The ${video.niche.toLowerCase()} mistake nobody talks about`,
      positioning: "A personal experiment framed as a lesson the viewer can copy.",
      contrast: "What everyone recommends vs. what actually worked.",
      personalization: "Swap in your own result and your own daily metric.",
    },
    hook: {
      line: "Most people get this completely wrong, and I did too.",
      reasons: [
        "Contrarian opening creates instant tension.",
        "Admitting a mistake builds trust in the first 3 seconds.",
        "Promises a specific fix without revealing it yet (curiosity gap).",
      ],
    },
    format: {
      type: "Personal breakdown",
      structure: ["Bold claim", "Personal proof", "Two-step method", "Result", "Save-worthy CTA"],
    },
    visual: [
      "Talking head, centered, tight crop.",
      "Bold captions with keyword highlights.",
      "Jump cut every 2-3 seconds.",
      "One on-screen number as proof at the midpoint.",
    ],
  };
}

export function analysisToLlmText(video: Video, a: Analysis) {
  return [
    `VIDEO: ${video.title} (${video.creator}, ${video.platform})`,
    `OUTLIER SCORE: ${video.outlierScore.toFixed(1)}x | VIEWS: ${video.views} | ENGAGEMENT: ${video.engagement}%`,
    `SUMMARY: ${a.summary}`,
    `HOOK: ${a.hook.line}`,
    `FORMAT: ${a.format.type} -> ${a.format.structure.join(" > ")}`,
    `IDEA: ${a.idea.title} | ${a.idea.positioning}`,
    `TRANSCRIPT:\n${a.transcript.join("\n")}`,
  ].join("\n\n");
}