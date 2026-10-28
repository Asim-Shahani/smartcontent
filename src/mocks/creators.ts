import type { Creator } from "@/types/channel";
import type { Platform } from "@/types/video";

const c = (
  handle: string,
  name: string,
  platform: Platform,
  niche: string,
  tags: string,
  followers: number,
  totalViews: number
): Creator => ({ handle, name, platform, niche, tags: tags.split(","), followers, totalViews });

export const niches = ["Productivity", "Fitness", "Tech", "Food", "Content", "Finance"];

export const creators: Creator[] = [
  // Productivity
  c("morningmaya", "Maya Mornings", "tiktok", "Productivity", "morning routine,habits,discipline,5am", 412_000, 38_000_000),
  c("focusfrank", "Focus Frank", "youtube", "Productivity", "focus,deep work,study,planning", 268_000, 21_000_000),
  c("plannerpia", "Planner Pia", "instagram", "Productivity", "planning,notion,to-do,organization", 154_000, 9_500_000),
  c("habitharbor", "Habit Harbor", "tiktok", "Productivity", "habits,self improvement,routine", 531_000, 52_000_000),
  c("calmcalendar", "Calm Calendar", "youtube", "Productivity", "time management,schedule,work life balance", 97_000, 6_200_000),
  // Fitness
  c("liftwithdan", "Lift With Dan", "instagram", "Fitness", "workout,gym,strength,muscle", 689_000, 61_000_000),
  c("homefitnora", "Home Fit Nora", "tiktok", "Fitness", "home workout,bodyweight,fat loss,beginner", 342_000, 29_000_000),
  c("runwithravi", "Run With Ravi", "youtube", "Fitness", "running,cardio,marathon,endurance", 121_000, 11_000_000),
  c("yogayasmin", "Yoga Yasmin", "instagram", "Fitness", "yoga,mobility,stretching,wellness", 207_000, 14_000_000),
  c("macrosmike", "Macros Mike", "tiktok", "Fitness", "nutrition,protein,diet,fat loss", 455_000, 40_000_000),
  // Tech
  c("toolstacked", "Tool Stacked", "youtube", "Tech", "apps,productivity tools,software,ai", 903_000, 88_000_000),
  c("deskdaily", "Desk Daily", "tiktok", "Tech", "desk setup,gadgets,workspace", 184_000, 12_000_000),
  c("gadgetgia", "Gadget Gia", "instagram", "Tech", "gadgets,reviews,phones,accessories", 276_000, 17_000_000),
  c("codecora", "Code Cora", "youtube", "Tech", "coding,programming,developer,career", 365_000, 33_000_000),
  c("aiaiden", "AI Aiden", "tiktok", "Tech", "ai,chatgpt,automation,tools", 618_000, 57_000_000),
  // Food
  c("prepwithpri", "Prep With Pri", "tiktok", "Food", "meal prep,healthy,budget meals", 298_000, 24_000_000),
  c("quickbitesquinn", "Quick Bites Quinn", "instagram", "Food", "recipes,easy dinner,quick meals", 512_000, 36_000_000),
  c("bakerbea", "Baker Bea", "youtube", "Food", "baking,desserts,bread", 174_000, 15_000_000),
  c("spicesam", "Spice Sam", "tiktok", "Food", "cooking,spices,world food,recipes", 233_000, 19_000_000),
  c("vegvera", "Veg Vera", "instagram", "Food", "vegan,plant based,healthy,recipes", 142_000, 8_000_000),
  // Content
  c("scriptsmith", "Script Smith", "instagram", "Content", "hooks,scriptwriting,storytelling,copywriting", 187_000, 13_000_000),
  c("creatorlab", "Creator Lab", "instagram", "Content", "creator tips,growth,content strategy,viral", 764_000, 71_000_000),
  c("hookhana", "Hook Hana", "tiktok", "Content", "hooks,short form,retention,editing", 329_000, 27_000_000),
  c("editelliot", "Edit Elliot", "youtube", "Content", "video editing,capcut,transitions,editing", 441_000, 39_000_000),
  c("growthgabe", "Growth Gabe", "tiktok", "Content", "followers,algorithm,growth,social media", 258_000, 20_000_000),
  // Finance
  c("pennywise.ali", "Penny Wise Ali", "youtube", "Finance", "budgeting,saving,frugal,money", 336_000, 30_000_000),
  c("investinivy", "Invest Ivy", "instagram", "Finance", "investing,stocks,index funds,beginner", 481_000, 42_000_000),
  c("sidehustlesid", "Side Hustle Sid", "tiktok", "Finance", "side hustle,income,freelance,online business", 627_000, 59_000_000),
  c("debtfreedee", "Debt Free Dee", "youtube", "Finance", "debt,credit score,saving,budgeting", 205_000, 16_000_000),
  c("cryptocleo", "Crypto Cleo", "instagram", "Finance", "crypto,bitcoin,investing,web3", 143_000, 7_000_000),
];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Method 3: manual search by handle, name, niche or tag
export function searchCreators(query: string): Creator[] {
  const q = query.trim().toLowerCase().replace(/^@/, "");
  if (!q) return [];
  return creators.filter((x) =>
    `${x.handle} ${x.name} ${x.niche} ${x.tags.join(" ")}`.toLowerCase().includes(q)
  );
}

const stop = new Set([
  "the", "and", "for", "who", "that", "with", "about", "post", "posts", "posting",
  "creators", "creator", "channels", "channel", "find", "want", "like", "show",
  "some", "short", "form", "videos", "video", "people", "accounts", "account",
  "make", "making", "talk", "talks", "into", "from", "their", "they", "are", "all",
]);

// Method 2: describe what you want in plain language. Always returns at least 5 channels.
export function describeCreators(text: string): { creators: Creator[]; relevant: number } {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !stop.has(w))
    .map((w) => (w.length > 3 ? w.replace(/s$/, "") : w));

  const scored = creators
    .map((x) => {
      const niche = x.niche.toLowerCase();
      const tags = x.tags.join(" ").toLowerCase();
      const name = `${x.handle} ${x.name}`.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (niche.includes(w)) score += 3;
        if (tags.includes(w)) score += 2;
        if (name.includes(w)) score += 1;
      }
      return { x, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.x.followers - a.x.followers)
    .map((s) => s.x);

  const result = scored.slice(0, 8);
  const relevant = result.length;
  if (result.length < 5) {
    const extra = [...creators]
      .sort((a, b) => b.followers - a.followers)
      .filter((x) => !result.includes(x));
    result.push(...extra.slice(0, 5 - result.length));
  }
  return { creators: result, relevant };
}

type UrlResult = { ok: true; creator: Creator } | { ok: false; error: string };

// Method 4: add via URL. Validates platform support and that the link points to a channel.
export function creatorFromUrl(input: string): UrlResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: "Paste a channel link first." };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, error: "That doesn't look like a valid link." };
  }

  const host = url.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
  let platform: Platform | null = null;
  if (host === "tiktok.com") platform = "tiktok";
  else if (host === "instagram.com") platform = "instagram";
  else if (host === "youtube.com" || host === "youtu.be") platform = "youtube";
  if (!platform) {
    return {
      ok: false,
      error: "Unsupported platform. Use a TikTok, Instagram or YouTube channel link.",
    };
  }

  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  let handle = "";
  if (platform === "tiktok") {
    if (parts[0]?.startsWith("@")) handle = parts[0].slice(1);
  } else if (platform === "instagram") {
    const reserved = ["p", "reel", "reels", "explore", "accounts", "stories", "tv"];
    if (parts[0] && !reserved.includes(parts[0])) handle = parts[0];
  } else {
    if (parts[0]?.startsWith("@")) handle = parts[0].slice(1);
    else if (["c", "user", "channel"].includes(parts[0] ?? "") && parts[1]) handle = parts[1];
  }
  handle = handle.trim().toLowerCase();

  if (!handle) {
    return {
      ok: false,
      error: "Couldn't find a channel in that link. Use the link to the profile or channel page.",
    };
  }

  const known = creators.find((x) => x.platform === platform && x.handle === handle);
  if (known) return { ok: true, creator: known };

  // Mock: any well-formed channel link counts as existing. The backend does the real lookup.
  const seed = hash(`${platform}:${handle}`);
  const followers = 5_000 + (seed % 495_000);
  return {
    ok: true,
    creator: {
      handle,
      name: handle,
      platform,
      niche: "Other",
      tags: [],
      followers,
      totalViews: followers * (20 + (seed % 60)),
    },
  };
}