import { create } from "zustand";

export interface DitherPrismHeroConfig {
  title1: string;
  title2: string;
  color1: string;
  color2: string;
  color3: string;
  speed: number;
  ditherIntensity: number;
  prismIntensity: number;
  particleCount: number;
  showParticles: boolean;
}

export interface SignatureConfig {
  text: string;
  color: string;
  fontSize: number;
  duration: number;
}

export const SIGNATURE_DEFAULT_CONFIG: SignatureConfig = {
  text: "Spider UI",
  color: "",
  fontSize: 48,
  duration: 1.5,
};

export interface CardStrokeConfig {
  title: string;
  description: string;
  accentStrokeColor: string;
  baseStrokeColor: string;
  textColor: string;
}

export const CARD_STROKE_DEFAULT_CONFIG: CardStrokeConfig = {
  title: "Card Title",
  description: "A small two line paragraph passed by prop.",
  accentStrokeColor: "#E0E0E0",
  baseStrokeColor: "#2B7FFF",
  textColor: "#F5F5F5",
};

export interface AvatarConfig {
  color:
    | "blue"
    | "orange"
    | "red"
    | "green"
    | "purple"
    | "yellow"
    | "cyan"
    | "pink"
    | "indigo"
    | "lime"
    | "turquoise"
    | "violet";
  size: "sm" | "md" | "lg";
  shape: "circle" | "square" | "squircle";
  blinking: boolean;
}

export const AVATAR_DEFAULT_CONFIG: AvatarConfig = {
  color: "blue",
  size: "md",
  shape: "circle",
  blinking: true,
};

export interface FooterConfig {
  theme:
    | "dia-browser"
    | "ocean"
    | "amber"
    | "emerald"
    | "violet"
    | "rose";
  copyrightText: string;
}

export const FOOTER_DEFAULT_CONFIG: FooterConfig = {
  theme: "dia-browser",
  copyrightText: `copyright © ${new Date().getFullYear()} — Spider UI`,
};

export interface GreetingPreloaderConfig {
  intervalMs: number;
}

export const GREETING_PRELOADER_DEFAULT_CONFIG: GreetingPreloaderConfig = {
  intervalMs: 300,
};

export interface StickerTrailConfig {
  spawnDistance: number;
  driftAmount: number;
  removeDelay: number;
  maxItems: number;
}

export const STICKER_TRAIL_DEFAULT_CONFIG: StickerTrailConfig = {
  spawnDistance: 76,
  driftAmount: 36,
  removeDelay: 1,
  maxItems: 8,
};

export type ImageTrailBlindDirection = "vertical" | "horizontal";

export interface ImageTrailConfig {
  imageLifespan: number;
  minDistance: number;
  revealDuration: number;
  fadeDuration: number;
  staggerDelay: number;
  lerpFactor: number;
  maxItems: number;
  slicesCount: number;
  blindDirection: ImageTrailBlindDirection;
}

export type MiniArchiveAccentColor =
  | "yellow"
  | "pink"
  | "cyan"
  | "violet"
  | "orange"
  | "emerald"
  | "black";

export interface MiniArchiveConfig {
  title: string;
  subtitle: string;
  accentColor: MiniArchiveAccentColor;
}

export const MINI_ARCHIVE_DEFAULT_CONFIG: MiniArchiveConfig = {
  title: "集めたもの",
  subtitle: "Mini Archive",
  accentColor: "orange",
};

export interface FanCardsConfig {
  spread: number;
  rotateStep: number;
  springStiffness: number;
  springDamping: number;
}

export const FAN_CARDS_DEFAULT_CONFIG: FanCardsConfig = {
  spread: 95,
  rotateStep: 8,
  springStiffness: 260,
  springDamping: 26,
};

export type DiaTextRevealMode = "single" | "rotate";

export type DiaTextRevealColorPreset = "dia" | "warm" | "cool";

export interface DiaTextRevealConfig {
  text: string;
  mode: DiaTextRevealMode;
  rotatePhrases: string[];
  colorPreset: DiaTextRevealColorPreset;
  duration: number;
  delay: number;
  repeatDelay: number;
}

export const DIA_TEXT_REVEAL_DEFAULT_CONFIG: DiaTextRevealConfig = {
  text: "Spider UI",
  mode: "single",
  rotatePhrases: ["build faster", "ship smarter", "scale easier"],
  colorPreset: "dia",
  duration: 1.5,
  delay: 0,
  repeatDelay: 1.2,
};

export interface AccordionRevealConfig {
  collapsedHeight: number;
  expandedHeight: number;
}

export const ACCORDION_REVEAL_DEFAULT_CONFIG: AccordionRevealConfig = {
  collapsedHeight: 68,
  expandedHeight: 320,
};

export const IMAGE_TRAIL_DEFAULT_CONFIG: ImageTrailConfig = {
  imageLifespan: 1000,
  minDistance: 45,
  revealDuration: 450,
  fadeDuration: 350,
  staggerDelay: 30,
  lerpFactor: 0.08,
  maxItems: 8,
  slicesCount: 10,
  blindDirection: "vertical",
};

export interface SplitFlapDisplayConfig {
  text: string;
  columns: number;
  size: "sm" | "md" | "lg";
  accentColor: string;
  showIndicators: boolean;
  staggerDelay: number;
  flipSpeed: number;
}

export const SPLIT_FLAP_DISPLAY_DEFAULT_CONFIG: SplitFlapDisplayConfig = {
  text: "SPIDER UI",
  columns: 11,
  size: "md",
  accentColor: "#22c55e",
  showIndicators: true,
  staggerDelay: 30,
  flipSpeed: 35,
};

export const DITHER_PRISM_HERO_DEFAULT_CONFIG: DitherPrismHeroConfig = {
  title1: "Experience",
  title2: "The Future",
  color1: "#0f0f23",
  color2: "#6366f1",
  color3: "#ec4899",
  speed: 1,
  ditherIntensity: 0.15,
  prismIntensity: 0.5,
  particleCount: 50,
  showParticles: true,
};

export interface HeroGeometricConfig {
  title1: string;
  title2: string;
  description: string;
  color1: string;
  color2: string;
  speed: number;
}

export const HERO_GEOMETRIC_DEFAULT_CONFIG: HeroGeometricConfig = {
  title1: "Elevate",
  title2: "Your Brand",
  description:
    "Scale your product with clarity, precision, and motion-led design.",
  color1: "#3B82F6",
  color2: "#F0F9FF",
  speed: 1,
};

export interface WebGLLiquidConfig {
  title: string;
  subtitle: string;
  description: string;
  colorDeep: string;
  colorMid: string;
  colorHighlight: string;
  speed: number;
  flowStrength: number;
  grain: number;
  contrast: number;
  opacity: number;
  reveal: boolean;
  delayMs: number;
}

export const WEBGL_LIQUID_DEFAULT_CONFIG: WebGLLiquidConfig = {
  title: "Fluid Motion",
  subtitle: "Premium Presence",
  description:
    "A cinematic liquid field tuned for modern hero sections with polished depth and restrained motion.",
  colorDeep: "#04050b",
  colorMid: "#134d93",
  colorHighlight: "#8cecff",
  speed: 1,
  flowStrength: 1,
  grain: 0.05,
  contrast: 1.1,
  opacity: 0.95,
  reveal: true,
  delayMs: 0,
};

export interface ClosingPlasmaConfig {
  speed: number;
  turbulence: number;
  mouseInfluence: number;
  grain: number;
  sparkle: number;
  vignette: number;
  opacity: number;
  interactive: boolean;
  darkColorA: string;
  darkColorB: string;
  darkColorC: string;
  lightColorA: string;
  lightColorB: string;
  lightColorC: string;
}

export const CLOSING_PLASMA_DEFAULT_CONFIG: ClosingPlasmaConfig = {
  speed: 1,
  turbulence: 1,
  mouseInfluence: 1,
  grain: 1,
  sparkle: 1,
  vignette: 1,
  opacity: 1,
  interactive: true,
  darkColorA: "#0d0d14",
  darkColorB: "#1f2540",
  darkColorC: "#4a6191",
  lightColorA: "#f0f2f7",
  lightColorB: "#d7dceb",
  lightColorC: "#bcc5e0",
};

interface PlaygroundStore {
  code: string;
  ditherPrismHeroConfig: DitherPrismHeroConfig;
  activeDitherPrismHeroPreset: string;
  ditherPrismHeroRenderVersion: number;
  heroGeometricConfig: HeroGeometricConfig;
  activeHeroGeometricPreset: string;
  heroGeometricRenderVersion: number;
  webglLiquidConfig: WebGLLiquidConfig;
  activeWebglLiquidPreset: string;
  webglLiquidRenderVersion: number;
  closingPlasmaConfig: ClosingPlasmaConfig;
  activeClosingPlasmaPreset: string;
  closingPlasmaRenderVersion: number;
  setCode: (code: string) => void;
  setDitherPrismHeroConfig: (config: DitherPrismHeroConfig) => void;
  updateDitherPrismHeroConfig: (
    updates: Partial<DitherPrismHeroConfig>,
  ) => void;
  setActiveDitherPrismHeroPreset: (preset: string) => void;
  resetDitherPrismHeroPreview: () => void;
  resetDitherPrismHeroConfig: () => void;
  setHeroGeometricConfig: (config: HeroGeometricConfig) => void;
  updateHeroGeometricConfig: (updates: Partial<HeroGeometricConfig>) => void;
  setActiveHeroGeometricPreset: (preset: string) => void;
  resetHeroGeometricPreview: () => void;
  resetHeroGeometricConfig: () => void;
  setWebglLiquidConfig: (config: WebGLLiquidConfig) => void;
  updateWebglLiquidConfig: (updates: Partial<WebGLLiquidConfig>) => void;
  setActiveWebglLiquidPreset: (preset: string) => void;
  resetWebglLiquidPreview: () => void;
  resetWebglLiquidConfig: () => void;
  setClosingPlasmaConfig: (config: ClosingPlasmaConfig) => void;
  updateClosingPlasmaConfig: (updates: Partial<ClosingPlasmaConfig>) => void;
  setActiveClosingPlasmaPreset: (preset: string) => void;
  resetClosingPlasmaPreview: () => void;
  resetClosingPlasmaConfig: () => void;
  signatureConfig: SignatureConfig;
  activeSignaturePreset: string;
  signatureRenderVersion: number;
  setSignatureConfig: (config: SignatureConfig) => void;
  updateSignatureConfig: (updates: Partial<SignatureConfig>) => void;
  setActiveSignaturePreset: (preset: string) => void;
  resetSignaturePreview: () => void;
  resetSignatureConfig: () => void;
  splitFlapDisplayConfig: SplitFlapDisplayConfig;
  activeSplitFlapDisplayPreset: string;
  splitFlapDisplayRenderVersion: number;
  setSplitFlapDisplayConfig: (config: SplitFlapDisplayConfig) => void;
  updateSplitFlapDisplayConfig: (updates: Partial<SplitFlapDisplayConfig>) => void;
  setActiveSplitFlapDisplayPreset: (preset: string) => void;
  resetSplitFlapDisplayPreview: () => void;
  resetSplitFlapDisplayConfig: () => void;
  cardStrokeConfig: CardStrokeConfig;
  activeCardStrokePreset: string;
  cardStrokeRenderVersion: number;
  setCardStrokeConfig: (config: CardStrokeConfig) => void;
  updateCardStrokeConfig: (updates: Partial<CardStrokeConfig>) => void;
  setActiveCardStrokePreset: (preset: string) => void;
  resetCardStrokePreview: () => void;
  resetCardStrokeConfig: () => void;
  avatarConfig: AvatarConfig;
  updateAvatarConfig: (updates: Partial<AvatarConfig>) => void;
  resetAvatarConfig: () => void;
  footerConfig: FooterConfig;
  updateFooterConfig: (updates: Partial<FooterConfig>) => void;
  resetFooterConfig: () => void;
  greetingPreloaderConfig: GreetingPreloaderConfig;
  greetingPreloaderRemountVersion: number;
  updateGreetingPreloaderConfig: (updates: Partial<GreetingPreloaderConfig>) => void;
  resetGreetingPreloaderConfig: () => void;
  resetGreetingPreloaderPreview: () => void;
  stickerTrailConfig: StickerTrailConfig;
  stickerTrailRemountVersion: number;
  updateStickerTrailConfig: (updates: Partial<StickerTrailConfig>) => void;
  resetStickerTrailConfig: () => void;
  resetStickerTrailPreview: () => void;
  imageTrailConfig: ImageTrailConfig;
  imageTrailRemountVersion: number;
  updateImageTrailConfig: (updates: Partial<ImageTrailConfig>) => void;
  resetImageTrailConfig: () => void;
  resetImageTrailPreview: () => void;
  miniArchiveConfig: MiniArchiveConfig;
  updateMiniArchiveConfig: (updates: Partial<MiniArchiveConfig>) => void;
  resetMiniArchiveConfig: () => void;
  fanCardsConfig: FanCardsConfig;
  updateFanCardsConfig: (updates: Partial<FanCardsConfig>) => void;
  resetFanCardsConfig: () => void;
  diaTextRevealConfig: DiaTextRevealConfig;
  diaTextRevealRemountVersion: number;
  updateDiaTextRevealConfig: (updates: Partial<DiaTextRevealConfig>) => void;
  resetDiaTextRevealConfig: () => void;
  resetDiaTextRevealPreview: () => void;
  accordionRevealConfig: AccordionRevealConfig;
  updateAccordionRevealConfig: (updates: Partial<AccordionRevealConfig>) => void;
  resetAccordionRevealConfig: () => void;
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  code: "",
  ditherPrismHeroConfig: DITHER_PRISM_HERO_DEFAULT_CONFIG,
  activeDitherPrismHeroPreset: "Default",
  ditherPrismHeroRenderVersion: 0,
  heroGeometricConfig: HERO_GEOMETRIC_DEFAULT_CONFIG,
  activeHeroGeometricPreset: "Default",
  heroGeometricRenderVersion: 0,
  webglLiquidConfig: WEBGL_LIQUID_DEFAULT_CONFIG,
  activeWebglLiquidPreset: "Default",
  webglLiquidRenderVersion: 0,
  closingPlasmaConfig: CLOSING_PLASMA_DEFAULT_CONFIG,
  activeClosingPlasmaPreset: "Default",
  closingPlasmaRenderVersion: 0,
  setCode: (code) => set({ code }),
  setDitherPrismHeroConfig: (config) => set({ ditherPrismHeroConfig: config }),
  updateDitherPrismHeroConfig: (updates) =>
    set((state) => ({
      ditherPrismHeroConfig: { ...state.ditherPrismHeroConfig, ...updates },
    })),
  setActiveDitherPrismHeroPreset: (preset) =>
    set({ activeDitherPrismHeroPreset: preset }),
  resetDitherPrismHeroPreview: () =>
    set((state) => ({
      ditherPrismHeroRenderVersion: state.ditherPrismHeroRenderVersion + 1,
    })),
  resetDitherPrismHeroConfig: () =>
    set((state) => ({
      ditherPrismHeroConfig: DITHER_PRISM_HERO_DEFAULT_CONFIG,
      activeDitherPrismHeroPreset: "Default",
      ditherPrismHeroRenderVersion: state.ditherPrismHeroRenderVersion + 1,
    })),
  setHeroGeometricConfig: (config) => set({ heroGeometricConfig: config }),
  updateHeroGeometricConfig: (updates) =>
    set((state) => ({
      heroGeometricConfig: { ...state.heroGeometricConfig, ...updates },
    })),
  setActiveHeroGeometricPreset: (preset) =>
    set({ activeHeroGeometricPreset: preset }),
  resetHeroGeometricPreview: () =>
    set((state) => ({
      heroGeometricRenderVersion: state.heroGeometricRenderVersion + 1,
    })),
  resetHeroGeometricConfig: () =>
    set((state) => ({
      heroGeometricConfig: HERO_GEOMETRIC_DEFAULT_CONFIG,
      activeHeroGeometricPreset: "Default",
      heroGeometricRenderVersion: state.heroGeometricRenderVersion + 1,
    })),
  setWebglLiquidConfig: (config) => set({ webglLiquidConfig: config }),
  updateWebglLiquidConfig: (updates) =>
    set((state) => ({
      webglLiquidConfig: { ...state.webglLiquidConfig, ...updates },
    })),
  setActiveWebglLiquidPreset: (preset) =>
    set({ activeWebglLiquidPreset: preset }),
  resetWebglLiquidPreview: () =>
    set((state) => ({
      webglLiquidRenderVersion: state.webglLiquidRenderVersion + 1,
    })),
  resetWebglLiquidConfig: () =>
    set((state) => ({
      webglLiquidConfig: WEBGL_LIQUID_DEFAULT_CONFIG,
      activeWebglLiquidPreset: "Default",
      webglLiquidRenderVersion: state.webglLiquidRenderVersion + 1,
    })),
  setClosingPlasmaConfig: (config) => set({ closingPlasmaConfig: config }),
  updateClosingPlasmaConfig: (updates) =>
    set((state) => ({
      closingPlasmaConfig: { ...state.closingPlasmaConfig, ...updates },
    })),
  setActiveClosingPlasmaPreset: (preset) =>
    set({ activeClosingPlasmaPreset: preset }),
  resetClosingPlasmaPreview: () =>
    set((state) => ({
      closingPlasmaRenderVersion: state.closingPlasmaRenderVersion + 1,
    })),
  resetClosingPlasmaConfig: () =>
    set((state) => ({
      closingPlasmaConfig: CLOSING_PLASMA_DEFAULT_CONFIG,
      activeClosingPlasmaPreset: "Default",
      closingPlasmaRenderVersion: state.closingPlasmaRenderVersion + 1,
    })),
  signatureConfig: SIGNATURE_DEFAULT_CONFIG,
  activeSignaturePreset: "Default",
  signatureRenderVersion: 0,
  setSignatureConfig: (config) => set({ signatureConfig: config }),
  updateSignatureConfig: (updates) =>
    set((state) => ({
      signatureConfig: { ...state.signatureConfig, ...updates },
    })),
  setActiveSignaturePreset: (preset) => set({ activeSignaturePreset: preset }),
  resetSignaturePreview: () =>
    set((state) => ({
      signatureRenderVersion: state.signatureRenderVersion + 1,
    })),
  resetSignatureConfig: () =>
    set((state) => ({
      signatureConfig: SIGNATURE_DEFAULT_CONFIG,
      activeSignaturePreset: "Default",
      signatureRenderVersion: state.signatureRenderVersion + 1,
    })),
  splitFlapDisplayConfig: SPLIT_FLAP_DISPLAY_DEFAULT_CONFIG,
  activeSplitFlapDisplayPreset: "Default",
  splitFlapDisplayRenderVersion: 0,
  setSplitFlapDisplayConfig: (config) => set({ splitFlapDisplayConfig: config }),
  updateSplitFlapDisplayConfig: (updates) =>
    set((state) => ({
      splitFlapDisplayConfig: { ...state.splitFlapDisplayConfig, ...updates },
    })),
  setActiveSplitFlapDisplayPreset: (preset) =>
    set({ activeSplitFlapDisplayPreset: preset }),
  resetSplitFlapDisplayPreview: () =>
    set((state) => ({
      splitFlapDisplayRenderVersion: state.splitFlapDisplayRenderVersion + 1,
    })),
  resetSplitFlapDisplayConfig: () =>
    set((state) => ({
      splitFlapDisplayConfig: SPLIT_FLAP_DISPLAY_DEFAULT_CONFIG,
      activeSplitFlapDisplayPreset: "Default",
      splitFlapDisplayRenderVersion: state.splitFlapDisplayRenderVersion + 1,
    })),
  cardStrokeConfig: CARD_STROKE_DEFAULT_CONFIG,
  activeCardStrokePreset: "Default",
  cardStrokeRenderVersion: 0,
  setCardStrokeConfig: (config) => set({ cardStrokeConfig: config }),
  updateCardStrokeConfig: (updates) =>
    set((state) => ({
      cardStrokeConfig: { ...state.cardStrokeConfig, ...updates },
    })),
  setActiveCardStrokePreset: (preset) => set({ activeCardStrokePreset: preset }),
  resetCardStrokePreview: () =>
    set((state) => ({
      cardStrokeRenderVersion: state.cardStrokeRenderVersion + 1,
    })),
  resetCardStrokeConfig: () =>
    set((state) => ({
      cardStrokeConfig: CARD_STROKE_DEFAULT_CONFIG,
      activeCardStrokePreset: "Default",
      cardStrokeRenderVersion: state.cardStrokeRenderVersion + 1,
    })),
  avatarConfig: AVATAR_DEFAULT_CONFIG,
  updateAvatarConfig: (updates) =>
    set((state) => ({
      avatarConfig: { ...state.avatarConfig, ...updates },
    })),
  resetAvatarConfig: () => set({ avatarConfig: AVATAR_DEFAULT_CONFIG }),
  footerConfig: FOOTER_DEFAULT_CONFIG,
  updateFooterConfig: (updates) =>
    set((state) => ({
      footerConfig: { ...state.footerConfig, ...updates },
    })),
  resetFooterConfig: () => set({ footerConfig: FOOTER_DEFAULT_CONFIG }),
  greetingPreloaderConfig: GREETING_PRELOADER_DEFAULT_CONFIG,
  greetingPreloaderRemountVersion: 0,
  updateGreetingPreloaderConfig: (updates) =>
    set((state) => ({
      greetingPreloaderConfig: {
        ...state.greetingPreloaderConfig,
        ...updates,
      },
    })),
  resetGreetingPreloaderConfig: () =>
    set((state) => ({
      greetingPreloaderConfig: GREETING_PRELOADER_DEFAULT_CONFIG,
      greetingPreloaderRemountVersion: state.greetingPreloaderRemountVersion + 1,
    })),
  resetGreetingPreloaderPreview: () =>
    set((state) => ({
      greetingPreloaderRemountVersion: state.greetingPreloaderRemountVersion + 1,
    })),
  stickerTrailConfig: STICKER_TRAIL_DEFAULT_CONFIG,
  stickerTrailRemountVersion: 0,
  updateStickerTrailConfig: (updates) =>
    set((state) => ({
      stickerTrailConfig: { ...state.stickerTrailConfig, ...updates },
    })),
  resetStickerTrailConfig: () =>
    set((state) => ({
      stickerTrailConfig: STICKER_TRAIL_DEFAULT_CONFIG,
      stickerTrailRemountVersion: state.stickerTrailRemountVersion + 1,
    })),
  resetStickerTrailPreview: () =>
    set((state) => ({
      stickerTrailRemountVersion: state.stickerTrailRemountVersion + 1,
    })),
  imageTrailConfig: IMAGE_TRAIL_DEFAULT_CONFIG,
  imageTrailRemountVersion: 0,
  updateImageTrailConfig: (updates) =>
    set((state) => ({
      imageTrailConfig: { ...state.imageTrailConfig, ...updates },
    })),
  resetImageTrailConfig: () =>
    set((state) => ({
      imageTrailConfig: IMAGE_TRAIL_DEFAULT_CONFIG,
      imageTrailRemountVersion: state.imageTrailRemountVersion + 1,
    })),
  resetImageTrailPreview: () =>
    set((state) => ({
      imageTrailRemountVersion: state.imageTrailRemountVersion + 1,
    })),
  miniArchiveConfig: MINI_ARCHIVE_DEFAULT_CONFIG,
  updateMiniArchiveConfig: (updates) =>
    set((state) => ({
      miniArchiveConfig: { ...state.miniArchiveConfig, ...updates },
    })),
  resetMiniArchiveConfig: () =>
    set({ miniArchiveConfig: MINI_ARCHIVE_DEFAULT_CONFIG }),
  fanCardsConfig: FAN_CARDS_DEFAULT_CONFIG,
  updateFanCardsConfig: (updates) =>
    set((state) => ({
      fanCardsConfig: { ...state.fanCardsConfig, ...updates },
    })),
  resetFanCardsConfig: () =>
    set({ fanCardsConfig: FAN_CARDS_DEFAULT_CONFIG }),
  diaTextRevealConfig: DIA_TEXT_REVEAL_DEFAULT_CONFIG,
  diaTextRevealRemountVersion: 0,
  updateDiaTextRevealConfig: (updates) =>
    set((state) => ({
      diaTextRevealConfig: { ...state.diaTextRevealConfig, ...updates },
    })),
  resetDiaTextRevealConfig: () =>
    set((state) => ({
      diaTextRevealConfig: DIA_TEXT_REVEAL_DEFAULT_CONFIG,
      diaTextRevealRemountVersion: state.diaTextRevealRemountVersion + 1,
    })),
  resetDiaTextRevealPreview: () =>
    set((state) => ({
      diaTextRevealRemountVersion: state.diaTextRevealRemountVersion + 1,
    })),
  accordionRevealConfig: ACCORDION_REVEAL_DEFAULT_CONFIG,
  updateAccordionRevealConfig: (updates) =>
    set((state) => ({
      accordionRevealConfig: { ...state.accordionRevealConfig, ...updates },
    })),
  resetAccordionRevealConfig: () =>
    set({ accordionRevealConfig: ACCORDION_REVEAL_DEFAULT_CONFIG }),
}));
