import { creators } from "@/mocks/creators";
import { platformNames } from "@/types/account";
import type { Collection, CollectionCategory } from "@/types/collection";

export const categoryMeta: {
  value: CollectionCategory;
  label: string;
  blurb: string;
}[] = [
  { value: "formats", label: "Formats", blurb: "Proven video structures you can reuse." },
  { value: "editing", label: "Editing Styles", blurb: "Cuts, effects and pacing patterns." },
  { value: "visual-hooks", label: "Visual Hooks", blurb: "Opening visuals that stop the scroll." },
  { value: "signature", label: "Signature Series", blurb: "Repeatable series that build an audience." },
];

// "Name|what it is": 22 + 30 + 47 + 6 = 105 collections (PRD FR-COL-01)
const raw: Record<CollectionCategory, string[]> = {
  formats: [
    "Myth vs Fact|Debunk a common belief",
    "Day in the Life|Follow one day with timestamps",
    "Before and After|Show a transformation result",
    "Step-by-Step Tutorial|Numbered how-to in order",
    "Listicle Countdown|Top items ranked from last to first",
    "Storytime|Personal story with a twist ending",
    "Case Study Breakdown|Analyze one real example in detail",
    "Reaction Video|React to another clip with commentary",
    "Interview Snippet|Short Q and A excerpt",
    "POV Skit|Scene shot from a character's view",
    "Product Review|Verdict-first review",
    "Comparison A vs B|Two options head to head",
    "Mistakes to Avoid|List of costly errors",
    "Challenge Series|Repeated attempt over several days",
    "Behind the Scenes|Show the process nobody sees",
    "Rant|Fast opinionated take",
    "Green Screen Explainer|Presenter over an article or chart",
    "Voiceover Montage|B-roll with narration",
    "Q and A Answer|Answer a viewer comment on camera",
    "Roleplay Dialogue|Two characters talking",
    "Quick Tip|One tip in under 20 seconds",
    "Results Reveal|Show the numbers at the end",
  ],
  editing: [
    "Jump Cuts|Remove pauses so a cut lands every two seconds",
    "Speed Ramp|Slow to fast tempo change",
    "Whip Pan Transition|Fast camera swipe between scenes",
    "Match Cut|Same shape or motion across two scenes",
    "Zoom Punch-In|Quick zoom on a key word",
    "Split Screen|Two frames side by side",
    "Text Pop-Ups|Words animate in on the beat",
    "Karaoke Captions|Word-by-word highlighted subtitles",
    "Beat-Synced Cuts|Cuts land on the music beat",
    "B-Roll Overlay|Cutaways over a talking head",
    "Freeze Frame|Pause on a key moment",
    "Rewind Effect|Reverse the clip for surprise",
    "Glitch Transition|Digital distortion between cuts",
    "Slow Motion Reveal|Slowed hero moment",
    "Time-Lapse|Hours compressed into seconds",
    "Picture-in-Picture|Small clip over the main video",
    "Mask Reveal|Object wipes to reveal the next scene",
    "Color Grade Shift|Palette changes with the mood",
    "Sound Effect Layering|Whooshes and hits under the edit",
    "Zoom Out Reveal|Pull back to show the context",
    "Cut on Action|Cut in the middle of movement",
    "Stop Motion|Frame-by-frame animation",
    "Screen Recording Overlay|Demo with a face cam",
    "Looping Ending|Last frame matches the first",
    "Progress Bar|On-screen bar to hold retention",
    "Emoji Reactions|Stickers used as emphasis",
    "Cinematic Letterbox|Black bars and a film grade",
    "Countdown Timer|On-screen clock builds tension",
    "Cutout Sticker|Subject outlined like a sticker",
    "Dolly Zoom|Background stretches behind the subject",
  ],
  "visual-hooks": [
    "3P Crash Zoom|Fast zoom into the subject on the first beat",
    "Object Slam Intro|An object hits the frame to open",
    "Impossible Transition|Scene change that looks physically impossible",
    "Giant Text Opener|Huge words fill the first frame",
    "Mid-Action Start|Open halfway through the action",
    "Countdown Opener|Numbers count down before the reveal",
    "Split Reveal|Frame splits open to show the subject",
    "Hand Cover Reveal|A hand covers then uncovers the lens",
    "Fast Zoom Smash|Smash zoom with an impact sound",
    "Floating Object|Item hovers in front of the face",
    "Mirror Flip|Frame flips as a mirror image",
    "Doorway Walk-Through|Walk through a door into the scene",
    "Snap Teleport|Snap of the fingers changes the location",
    "Number Flash|Big number flashes on screen",
    "Face Close-Up Shock|Tight face shot with a strong reaction",
    "Blur to Sharp|Opening blur resolves into focus",
    "Hidden Object Hunt|Viewer is asked to spot something",
    "Spin Whip Intro|Spin that whips into the first shot",
    "Cash Drop|Money falls into the frame",
    "Screen Shatter|Glass breaks to reveal the video",
    "Reverse Pour|Liquid pours backwards",
    "Peeking Frame|Subject peeks in from the edge",
    "Sticky Note Reveal|Notes peeled away to show text",
    "Cursor Click Intro|A cursor clicks to start the scene",
    "Paper Rip Reveal|Paper tears to show the title",
    "Light Switch Flip|Lights flip from dark to bright",
    "Drone Descent|High shot dives down to the subject",
    "Phone Throw Cut|Phone tossed from one shot to the next",
    "Price Tag Flash|Price appears before any context",
    "Red Circle Highlight|Circle draws attention to a detail",
    "Arrow Pointer|Animated arrow points at the point of interest",
    "Before/After Slider|Slider wipes between two states",
    "Stacked Cards Fan|Cards fan out to show options",
    "Shadow Silhouette|Subject starts as a dark outline",
    "Scale Comparison|Object next to something familiar for scale",
    "Underwater Reveal|Surface breaks to show the shot",
    "Paint Splash|Color splashes across the frame",
    "Spotlight Pop|Spotlight snaps onto the subject",
    "Timer Slam|Timer drops in at the start",
    "Browser Tab Flood|Many tabs open at once",
    "Cheering Crowd Cut|Crowd noise and a quick cut",
    "Close-Up Texture|Macro shot of an interesting surface",
    "Pointing Finger|Finger points directly at the viewer",
    "Slow Pull-Back|Camera slowly pulls away to show the scene",
    "Stopwatch Challenge|Race against a visible clock",
    "Neon Text Flicker|Glowing words flicker on",
    "Fast Scroll Feed|Rapid scroll through a feed",
  ],
  signature: [
    "Roast My Setup|Review setups sent in by viewers",
    "30-Day Experiment|Daily updates on one experiment",
    "Things I Wish I Knew|Recurring list of hard-won lessons",
    "Rating Everything|Tier-list verdicts on one topic",
    "Guess the Price|Interactive price reveal",
    "One Dollar vs One Hundred|Cheap versus expensive version",
  ],
};

const breakdownTemplates: Record<CollectionCategory, { label: string; text: string }[]> = {
  formats: [
    { label: "Structure", text: "Open with the payoff or claim, deliver {name} in three beats, then close with a clear next step. In short: {hint}." },
    { label: "Why it works", text: "Viewers recognise the pattern within seconds, so they stay to see how this version resolves it." },
    { label: "How to use it", text: "Pick one idea from your niche, fit it into this structure, and keep every beat under 8 seconds." },
    { label: "Best for", text: "Educational and opinion-led niches where one clear takeaway per video is enough." },
  ],
  editing: [
    { label: "What it is", text: "{name}: {hint}." },
    { label: "How to do it", text: "Mark the moment you want to emphasise, apply the effect for 0.2 to 0.5 seconds, and match it with a sound effect." },
    { label: "When to use it", text: "Use it at the hook, on a key word, or at a pattern break, not on every cut." },
    { label: "Common mistake", text: "Overusing it. If every second has an effect, none of them feel special." },
  ],
  "visual-hooks": [
    { label: "First frame", text: "The video opens on {name}: {hint}." },
    { label: "Motion", text: "Something moves or changes within the first 0.5 seconds so the thumb stops scrolling." },
    { label: "Why it stops the scroll", text: "It creates a question the viewer wants answered, which the spoken hook then resolves." },
    { label: "How to recreate", text: "Shoot the opening shot first, then record the line that explains it. Test two versions of the first frame." },
  ],
  signature: [
    { label: "Series premise", text: "{name}: {hint}." },
    { label: "Episode formula", text: "Keep the same title card, the same first line and the same ending so viewers know what they will get." },
    { label: "Recurring elements", text: "A fixed hook, one running joke or metric, and a closing line that teases the next episode." },
    { label: "Growth angle", text: "Series give viewers a reason to follow, because the next episode is already promised." },
  ],
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function fill(text: string, name: string, hint: string) {
  const lower = hint.charAt(0).toLowerCase() + hint.slice(1);
  return text.replaceAll("{name}", name).replaceAll("{hint}", lower);
}

function build(category: CollectionCategory, entry: string): Collection {
  const [name, hint] = entry.split("|");
  const h = hash(name);
  return {
    id: slug(name),
    name,
    category,
    hint,
    description: `${hint}. Study the examples, then copy the structure into your own script.`,
    isNew: h % 7 === 0, // stands in for the weekly additions (FR-COL-06)
    examples: Array.from({ length: 4 }, (_, i) => {
      const c = creators[(h + i * 7) % creators.length];
      return {
        creator: c.handle,
        platform: c.platform,
        title: `${name} (${c.niche.toLowerCase()} version)`,
        views: 120_000 + (hash(`${name}${i}`) % 2_400_000),
      };
    }),
    breakdown: breakdownTemplates[category].map((b) => ({
      label: b.label,
      text: fill(b.text, name, hint),
    })),
    transcript: [
      "[0:00] Wait, watch this.",
      `[0:03] This is the ${name} pattern, and it works every time.`,
      "[0:09] Step one: show the result before you explain anything.",
      "[0:16] Step two: give one clear reason, not five.",
      "[0:24] Step three: end on a line that makes people want part two.",
      "[0:30] Save this and try it on your next video.",
    ],
  };
}

export const collections: Collection[] = (
  Object.entries(raw) as [CollectionCategory, string[]][]
).flatMap(([category, entries]) => entries.map((e) => build(category, e)));

export const getCollection = (id: string) => collections.find((c) => c.id === id);

export function toReferenceSheet(c: Collection) {
  const category = categoryMeta.find((m) => m.value === c.category)?.label ?? "";
  return [
    `# ${c.name}`,
    `Category: ${category}`,
    "",
    c.description,
    "",
    "## Breakdown",
    ...c.breakdown.map((b) => `### ${b.label}\n${b.text}`),
    "",
    "## Examples",
    ...c.examples.map(
      (e) =>
        `- ${e.title} (@${e.creator}, ${platformNames[e.platform]}): ${e.views.toLocaleString("en-US")} views`
    ),
    "",
    "## Transcript of the top example",
    ...c.transcript,
  ].join("\n");
}