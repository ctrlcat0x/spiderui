export type ComponentCategory =
  | "Primitives"
  | "Components"
  | "AI Input"
  | "Text Effects"
  | "Backgrounds"
  | "Card Interactions"
  | "Visual Interactions"
  | "FAQ"
  | "Logo Clouds"
  | "Pricing"
  | "Carousels";

const PRIMITIVE_SLUG_ORDER = [
  "avatar",
  "badge",
  "switch",
  "toggle",
  "rich-button",
  "otp-input",
  "smooth-input",
  "elastic-slider",
  "modal",
  "drawer",
  "discrete-tabs",
  "stepper",
  "progressive-blur",
] as const;

export interface ComponentMetadata {
  title: string;
  description: string;
  category: ComponentCategory;
  slug: string;
  addedAt?: string;
  previewImage?: string;
}

const NEW_BADGE_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export function isNewComponent(component: ComponentMetadata): boolean {
  if (!component.addedAt) return false;
  const addedTime = new Date(component.addedAt).getTime();
  return Date.now() - addedTime < NEW_BADGE_DURATION_MS;
}

export const components: Record<string, ComponentMetadata> = {
  "ai-prompt-box": {
    title: "AI Prompt Box",
    description:
      "A self-contained AI composer with attachments, tool modes, voice state, and loading controls.",
    category: "AI Input",
    slug: "ai-prompt-box",
    addedAt: "2026-08-01",
  },
  "prompt-input": {
    title: "Prompt Input",
    description:
      "An elastic AI composer with model, effort, attachment, voice, and submit controls.",
    category: "AI Input",
    slug: "prompt-input",
    addedAt: "2026-08-01",
  },
  "opos-hover": {
    title: "OPOS Hover",
    description:
      "Quote-word thumbnails with a giant headline swap on hover, per-character GSAP reveals, and a cursor dot that expands into a bubble.",
    category: "Components",
    slug: "opos-hover",
    addedAt: "2026-06-04",
    previewImage: "/previews/opos-hover.png",
  },
  "scrub-input": {
    title: "Scrub Input",
    description: "An inline interactive slider styled as a pill.",
    category: "Components",
    slug: "scrub-input",
    addedAt: "2026-02-27",
    previewImage: "/previews/scrub-input.png",
  },
  signature: {
    title: "Signature",
    description:
      "An animated SVG signature effect that draws out text as if hand-written.",
    category: "Components",
    slug: "signature",
    addedAt: "2026-03-17",
    previewImage: "/previews/signature.png",
  },
  "image-trail": {
    title: "Image Trail",
    description:
      "Venetian-blind cursor image trail with staggered slice reveals and smoothed pointer tracking.",
    category: "Visual Interactions",
    slug: "image-trail",
    addedAt: "2026-03-09",
    previewImage: "/previews/image-trail.png",
  },
  "sticker-trail": {
    title: "Sticker Trail",
    description:
      "Motion-powered cursor trail of drifting stickers that spawn and fade as you move the pointer.",
    category: "Visual Interactions",
    slug: "sticker-trail",
    addedAt: "2026-06-01",
    previewImage: "/previews/sticker-trail.png",
  },
  "marquee-along-path": {
    title: "Marquee Along Path",
    description:
      "A responsive SVG-path marquee with hover pause, pointer scrubbing, rolling depth, and reduced-motion support.",
    category: "Visual Interactions",
    slug: "marquee-along-path",
    addedAt: "2026-08-01",
  },
  "feedback-input": {
    title: "Feedback Input",
    description:
      "A playful satisfaction meter with native emoji and animated feedback bursts.",
    category: "Visual Interactions",
    slug: "feedback-input",
    addedAt: "2026-08-20",
  },
  "rich-button": {
    title: "Rich Button",
    description:
      "A tactile gradient button with restrained color variants and press feedback.",
    category: "Primitives",
    slug: "rich-button",
    addedAt: "2026-08-19",
  },
  "bounce-sidebar": {
    title: "Bounce Sidebar",
    description:
      "A compact sidebar with a springing active indicator and accessible navigation items.",
    category: "Visual Interactions",
    slug: "bounce-sidebar",
    addedAt: "2026-08-19",
  },
  "card-stroke": {
    title: "Card Stroke",
    description:
      "A card with animated SVG strokes and word-by-word text reveal on hover.",
    category: "Card Interactions",
    slug: "card-stroke",
    addedAt: "2026-06-01",
    previewImage: "/previews/card-stroke.png",
  },
  avatar: {
    title: "Avatar",
    description:
      "An animated AI orb avatar with blinking eyes, 12 colors, 3 sizes, and 3 shapes.",
    category: "Primitives",
    slug: "avatar",
    addedAt: "2026-06-01",
    previewImage: "/previews/avatar.png",
  },
  badge: {
    title: "Badge",
    description:
      "A badge with semantic and full-spectrum color variants built on Base UI.",
    category: "Primitives",
    slug: "badge",
    addedAt: "2026-06-01",
    previewImage: "/previews/badge.png",
  },
  switch: {
    title: "Switch",
    description:
      "Liquid-glass toggle with spring thumb motion, drag scrubbing, and grab-to-morph interaction inspired by Apple.",
    category: "Primitives",
    slug: "switch",
    addedAt: "2026-06-09",
    previewImage: "/previews/switch.png",
  },
  toggle: {
    title: "Toggle",
    description:
      "A compact on/off switch with accent-state color, spring thumb motion, and reduced-motion support.",
    category: "Primitives",
    slug: "toggle",
    addedAt: "2026-08-05",
  },
  "otp-input": {
    title: "OTP Input",
    description:
      "Accessible verification-code slots with separators, masking, validation states, and reduced-motion support.",
    category: "Primitives",
    slug: "otp-input",
    addedAt: "2026-07-22",
  },
  "smooth-input": {
    title: "Smooth Input",
    description:
      "A text field with a spring-following caret, stable measurement, and accessible field states.",
    category: "Primitives",
    slug: "smooth-input",
    addedAt: "2026-07-31",
  },
  "elastic-slider": {
    title: "Elastic Slider",
    description:
      "A tactile slider with spring motion, precise steps, and complete pointer and keyboard controls.",
    category: "Primitives",
    slug: "elastic-slider",
    addedAt: "2026-07-31",
  },
  modal: {
    title: "Modal",
    description:
      "An accessible modal with responsive sizes, optional close control, and flexible footer alignment.",
    category: "Primitives",
    slug: "modal",
    addedAt: "2026-07-31",
  },
  drawer: {
    title: "Drawer",
    description:
      "An accessible draggable side panel with configurable footer alignment and an optional handle.",
    category: "Primitives",
    slug: "drawer",
    addedAt: "2026-07-31",
  },
  "discrete-tabs": {
    title: "Discrete Tabs",
    description:
      "Accessible icon tabs that expand the active label with spring layout and blur-fade motion.",
    category: "Primitives",
    slug: "discrete-tabs",
    addedAt: "2026-07-31",
  },
  stepper: {
    title: "Stepper",
    description:
      "Accessible multi-step flows with visited-step navigation, keyboard controls, spring progress, and directional panels.",
    category: "Primitives",
    slug: "stepper",
    addedAt: "2026-08-01",
  },
  "dia-footer": {
    title: "Dia Footer",
    description:
      "A scroll-driven footer with animated spectrum bars, inspired by Dia browser.",
    category: "Components",
    slug: "dia-footer",
    addedAt: "2026-06-01",
    previewImage: "/previews/dia-footer.png",
  },
  "image-2-gif": {
    title: "Image 2 Gif",
    description:
      "Frame-sequence player that cycles still images into a GIF-like loop with preload and custom renderers.",
    category: "Visual Interactions",
    slug: "image-2-gif",
    addedAt: "2026-06-09",
    previewImage: "/previews/image-2-gif.png",
  },
  "greeting-preloader": {
    title: "Greetings Preloader",
    description:
      "A multilingual greeting preloader with Motion transitions and a GSAP page reveal.",
    category: "Components",
    slug: "greeting-preloader",
    addedAt: "2026-06-01",
  },
  "spotify-card": {
    title: "Spotify Card",
    description:
      "Spotify track card with blurred art, vinyl animation, preview playback, and seek controls.",
    category: "Components",
    slug: "spotify-card",
    addedAt: "2026-06-01",
    previewImage: "/previews/spotify-card.png",
  },
  "vertical-spotify-card": {
    title: "Vertical Spotify Card",
    description:
      "Tall vertical Spotify card with progressive blur album art, seek bar, and transport controls.",
    category: "Components",
    slug: "vertical-spotify-card",
    addedAt: "2026-06-01",
    previewImage: "/previews/vertical-spotify-card.png",
  },
  "album-cards": {
    title: "Album Cards",
    description:
      "Stacked Spotify album covers with click-to-eject spinning vinyl, reflections, and neighbor dimming.",
    category: "Components",
    slug: "album-cards",
    addedAt: "2026-06-01",
    previewImage: "/previews/album-cards.png",
  },
  "mini-archive": {
    title: "Mini Archive",
    description:
      "A 3D glass folder with hinged cover, frosted blur, and stamp cards that fan out on open.",
    category: "Components",
    slug: "mini-archive",
    addedAt: "2026-06-05",
    previewImage: "/previews/mini-archive.png",
  },
  "fan-cards": {
    title: "Fan Cards",
    description:
      "A fan-out card stack with hover lift, spring focus, and receding background cards.",
    category: "Card Interactions",
    slug: "fan-cards",
    addedAt: "2026-06-05",
    previewImage: "/previews/fan-cards.png",
  },
  "accordion-reveal": {
    title: "Accordion Reveal",
    description:
      "Hover-expand rows with full-bleed imagery, indexed labels, and dimmed siblings.",
    category: "Card Interactions",
    slug: "accordion-reveal",
    addedAt: "2026-06-06",
    previewImage: "/previews/accordion-reveal.png",
  },
  "dia-text-reveal": {
    title: "Dia Text Reveal",
    description:
      "A sweeping gradient band reveals text, then settles on your theme foreground color.",
    category: "Text Effects",
    slug: "dia-text-reveal",
    addedAt: "2026-06-06",
    previewImage: "/previews/dia-text-reveal.png",
  },
  "encrypted-text": {
    title: "Encrypted Text",
    description:
      "A viewport-triggered scramble effect that resolves gibberish into readable text one character at a time.",
    category: "Text Effects",
    slug: "encrypted-text",
    addedAt: "2026-07-21",
  },
  "scramble-text": {
    title: "Scramble Text",
    description:
      "A stable typewriter reveal with a short scrambling edge, refined caret presets, and imperative replay controls.",
    category: "Text Effects",
    slug: "scramble-text",
    addedAt: "2026-07-21",
  },
  "text-roll": {
    title: "Text Roll",
    description:
      "A compact 3D text rotator that rolls through words while reserving enough width for the longest item.",
    category: "Text Effects",
    slug: "text-roll",
    addedAt: "2026-07-21",
  },
  "underline-hover": {
    title: "Underline Hover",
    description:
      "A hand-drawn underline that sketches in on hover or keyboard focus and cycles through organic stroke shapes.",
    category: "Text Effects",
    slug: "underline-hover",
    addedAt: "2026-07-21",
  },
  "wave-text": {
    title: "Wave Text",
    description:
      "A pointer-led character ripple that travels through text with configurable glyph sets.",
    category: "Text Effects",
    slug: "wave-text",
    addedAt: "2026-07-21",
  },
  "progressive-blur": {
    title: "Progressive Blur",
    description:
      "A composable edge treatment that progressively blurs scrolling content into its container background.",
    category: "Primitives",
    slug: "progressive-blur",
    addedAt: "2026-07-21",
  },
  "cloud-background": {
    title: "Cloud Background",
    description:
      "A soft procedural cloud field with custom sky colors, speed, reduced-motion support, and automatic off-screen pausing.",
    category: "Backgrounds",
    slug: "cloud-background",
    addedAt: "2026-07-21",
  },
  "curtain-background": {
    title: "Curtain Background",
    description:
      "A flowing simplex-noise field with layered crimson light, animated grain, and a soft vignette.",
    category: "Backgrounds",
    slug: "curtain-background",
    addedAt: "2026-07-21",
  },
  "waves-shader-background": {
    title: "Waves Shader Background",
    description:
      "A grainy procedural blue wave field with configurable color, flow, surface treatment, and automatic animation pausing.",
    category: "Backgrounds",
    slug: "waves-shader-background",
    addedAt: "2026-08-01",
  },
  "logo-cloud-001": {
    title: "Logo Cloud 001",
    description:
      "Animated logo cloud with staggered fade-in and group cycling.",
    category: "Logo Clouds",
    slug: "logo-cloud-001",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-001.png",
  },
  "logo-cloud-002": {
    title: "Logo Cloud 002",
    description:
      "Animated logo cloud that cycles groups of 3 logos with spring blur transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-002",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-002.png",
  },
  "logo-cloud-003": {
    title: "Logo Cloud 003",
    description:
      "CSS-animated logo carousel that cycles groups with vertical blur and slide transitions.",
    category: "Logo Clouds",
    slug: "logo-cloud-003",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-003.png",
  },
  "logo-cloud-004": {
    title: "Logo Cloud 004",
    description:
      "CSS marquee logo cloud with configurable direction, speed, gap, and gradient fade edges.",
    category: "Logo Clouds",
    slug: "logo-cloud-004",
    addedAt: "2026-06-01",
    previewImage: "/previews/logo-cloud-004.png",
  },
  "logo-cloud-005": {
    title: "Logo Cloud 005",
    description:
      "Bordered logo grid with grayscale hover reveal, dimmed siblings, and company metadata.",
    category: "Logo Clouds",
    slug: "logo-cloud-005",
    addedAt: "2026-06-10",
    previewImage: "/previews/logo-cloud-005.png",
  },
  "logo-cloud-006": {
    title: "Logo Cloud 006",
    description:
      "Case-study logo grid with multi-line title and hover-to-reveal study links.",
    category: "Logo Clouds",
    slug: "logo-cloud-006",
    addedAt: "2026-06-10",
    previewImage: "/previews/logo-cloud-006.png",
  },
  "pricing-001": {
    title: "Pricing 001",
    description:
      "Modern pricing grid with animated sliding numbers, yearly billing toggle, and featured plan corner decorations.",
    category: "Pricing",
    slug: "pricing-001",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-001.png",
  },
  "pricing-002": {
    title: "Pricing 002",
    description:
      "Three-column pricing with a gradient featured card and illustrated cursor decoration.",
    category: "Pricing",
    slug: "pricing-002",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-002.png",
  },
  "pricing-003": {
    title: "Pricing 003",
    description:
      "Asymmetric three-column pricing with an elevated featured plan, amber badge, and security footer note.",
    category: "Pricing",
    slug: "pricing-003",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-003.png",
  },
  "pricing-004": {
    title: "Pricing 004",
    description:
      "Horizontal list-style pricing with accent blobs, strikethrough prices, and optional recommended badge.",
    category: "Pricing",
    slug: "pricing-004",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-004.png",
  },
  "pricing-005": {
    title: "Pricing 005",
    description:
      "Tabbed individuals/teams pricing grid with coloured card backdrops, Avatar orbs, grain overlays, and feature checklists.",
    category: "Pricing",
    slug: "pricing-005",
    addedAt: "2026-06-01",
    previewImage: "/previews/pricing-005.png",
  },
  "pricing-006": {
    title: "Pricing 006",
    description:
      "Split two-plan pricing with header label, icon feature rows, and a most-popular badge.",
    category: "Pricing",
    slug: "pricing-006",
    addedAt: "2026-06-10",
    previewImage: "/previews/pricing-006.png",
  },
  "carousel-001": {
    title: "Carousel 001",
    description:
      "Hero carousel with pill timer pagination, arrow controls, and blur-fade slide transitions.",
    category: "Carousels",
    slug: "carousel-001",
    addedAt: "2026-06-09",
    previewImage: "/previews/carousel-001.png",
  },
  "carousel-002": {
    title: "Carousel 002",
    description:
      "Split editorial carousel with large arrows, timed progress pills, and blur-fade image transitions.",
    category: "Carousels",
    slug: "carousel-002",
    addedAt: "2026-06-10",
    previewImage: "/previews/carousel-002.png",
  },
  "carousel-003": {
    title: "Carousel 003",
    description:
      "Gallery carousel with floating pill controls, expanding dot timer, pause/replay, and horizontal blur-slide transitions.",
    category: "Carousels",
    slug: "carousel-003",
    addedAt: "2026-06-10",
    previewImage: "/previews/carousel-003.png",
  },
  "carousel-004": {
    title: "Carousel 004",
    description:
      "Spring-driven image gallery with a large draggable stage, expanding thumbnail rail, arrow controls, and autoplay.",
    category: "Carousels",
    slug: "carousel-004",
    addedAt: "2026-08-01",
  },
  "contribution-graph": {
    title: "Contribution Graph",
    description:
      "Interactive GitHub heatmap with seven themes, hover ripples, ambient motion, responsive sizing, and accessible tooltips.",
    category: "Components",
    slug: "contribution-graph",
    addedAt: "2026-06-10",
    previewImage: "/previews/contribution-graph.png",
  },
  "github-repo-card": {
    title: "GitHub Repo Card",
    description:
      "Server-rendered repository card with cached GitHub metadata, topic tags, language, and stats.",
    category: "Components",
    slug: "github-repo-card",
    addedAt: "2026-07-21",
  },
  "phone-mockup": {
    title: "Phone Mockup",
    description:
      "An iPhone-style device frame with custom screen content, image support, and animated carousel or stack layouts.",
    category: "Components",
    slug: "phone-mockup",
    addedAt: "2026-07-22",
  },
  "wheel-date-picker": {
    title: "Wheel Date Picker",
    description:
      "Inertial month, day, and year wheels with cylindrical depth, spring snapping, and keyboard control.",
    category: "Components",
    slug: "wheel-date-picker",
    addedAt: "2026-07-21",
  },
  "wheel-time-picker": {
    title: "Wheel Time Picker",
    description:
      "Inertial time wheels with optional minute and second columns that resize the picker automatically.",
    category: "Components",
    slug: "wheel-time-picker",
    addedAt: "2026-07-21",
  },
  vestaboard: {
    title: "Vestaboard",
    description:
      "A mechanical split-flap display with inset two-part panels, optional color tiles, custom speed, rows, and columns.",
    category: "Visual Interactions",
    slug: "vestaboard",
    addedAt: "2026-07-20",
    previewImage: "/previews/vestaboard.png",
  },
  "preview-rail": {
    title: "Preview Rail",
    description:
      "Responsive marker rail with spring-scaled indicators and blur-fade preview transitions.",
    category: "Visual Interactions",
    slug: "preview-rail",
    addedAt: "2026-07-21",
  },
  "motion-accordion": {
    title: "Motion Accordion",
    description:
      "Rounded FAQ accordion with spring height, scale, and plus-to-minus transitions.",
    category: "FAQ",
    slug: "motion-accordion",
    addedAt: "2026-07-20",
  },
  "bouncy-accordion": {
    title: "Bouncy Accordion",
    description:
      "Spring-grouped FAQ rows with controlled state, icons, disabled items, and customizable slots.",
    category: "FAQ",
    slug: "bouncy-accordion",
    addedAt: "2026-07-20",
  },
  "line-accordion": {
    title: "Line Accordion",
    description:
      "A restrained FAQ accordion with dividing lines, smooth height transitions, and a plus-to-minus indicator.",
    category: "FAQ",
    slug: "line-accordion",
    addedAt: "2026-07-21",
  },
  "video-player-001": {
    title: "Video Player 001",
    description:
      "Cursor-following play control with blur-fade thumbnails and YouTube-style ambient glow.",
    category: "Visual Interactions",
    slug: "video-player-001",
    addedAt: "2026-06-10",
    previewImage: "/previews/video-player-001.png",
  },
  "video-player-002": {
    title: "Video Player 002",
    description:
      "Inline player with centered play, sliding controls, scrubber, volume, and optional ambient glow.",
    category: "Visual Interactions",
    slug: "video-player-002",
    addedAt: "2026-06-10",
    previewImage: "/previews/video-player-002.png",
  },
};

export function getComponent(slug: string) {
  return components[slug];
}

export function isPrimitiveComponent(slug: string): boolean {
  return components[slug]?.category === "Primitives";
}

export function getComponentDocsHref(slug: string): string {
  if (isPrimitiveComponent(slug)) {
    return `/docs/components/primitives/${slug}`;
  }
  return `/docs/components/${slug}`;
}

function primitiveSlugSortIndex(slug: string): number {
  const index = PRIMITIVE_SLUG_ORDER.indexOf(
    slug as (typeof PRIMITIVE_SLUG_ORDER)[number],
  );
  return index === -1 ? PRIMITIVE_SLUG_ORDER.length : index;
}

export function getPrimitiveSlugs(): string[] {
  return Object.values(components)
    .filter((c) => c.category === "Primitives")
    .map((c) => c.slug)
    .sort((a, b) => primitiveSlugSortIndex(a) - primitiveSlugSortIndex(b));
}

export function compareComponentsInCategory(
  a: ComponentMetadata,
  b: ComponentMetadata,
): number {
  if (a.category === "Primitives" && b.category === "Primitives") {
    return primitiveSlugSortIndex(a.slug) - primitiveSlugSortIndex(b.slug);
  }
  return a.title.localeCompare(b.title);
}
