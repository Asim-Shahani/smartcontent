import type { Video } from "@/types/video";
import type { Analysis } from "@/mocks/analysis";
import type { Idea } from "@/types/idea";

export function buildIdea(video: Video, a: Analysis): Idea {
  return {
    id: `idea_${video.id}`,
    title: a.idea.title,
    sourceVideoId: video.id,
    creator: video.creator,
    views: video.views,
    engagement: video.engagement,
    positioning: a.idea.positioning,
    format: a.format.type,
    contrast: a.idea.contrast,
    personalization: a.idea.personalization,
    shortlisted: false,
  };
}