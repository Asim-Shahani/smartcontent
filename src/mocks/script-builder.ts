import type { Video } from "@/types/video";
import type { ScriptBlocks } from "@/types/script";
import type { Analysis } from "@/mocks/analysis";

export function buildScript(video: Video, a: Analysis): ScriptBlocks {
  return {
    hook: a.hook.line,
    introduction: `I'm going to show you the one change that made the biggest difference in ${video.niche.toLowerCase()}. It took me weeks to figure out, so you don't have to.`,
    main: "1) Skip the obvious advice everyone repeats.\n2) Track one number every single day.\n3) Compare week one to week two and keep only what moved the number.",
    storyFlow: a.format.structure.join("  >  "),
    cta: "Save this and try it for one week. Follow for part two, where I share the exact numbers.",
    ending: "The difference was impossible to ignore. Now it's your turn.",
  };
}

// Expanding is free in v1 (PRD FR-SCR-03 / acceptance criteria)
export function expandBlocks(b: ScriptBlocks): ScriptBlocks {
  return {
    ...b,
    main:
      b.main +
      "\n\nDeeper dive: break the method into two concrete examples the viewer can copy today, and show the number you tracked on screen.",
    storyFlow:
      b.storyFlow +
      "\n\nAdd a mid-video pattern interrupt: a quick cut to the result, then return to the method.",
    ending:
      b.ending + " Loop back to the opening line so the video replays naturally.",
  };
}