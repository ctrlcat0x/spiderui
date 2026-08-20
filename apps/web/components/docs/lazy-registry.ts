import type React from "react";

const docsImportMap: Record<
  string,
  () => Promise<
    | { default: React.ComponentType<Record<string, unknown>> }
    | { [key: string]: React.ComponentType<Record<string, unknown>> }
  >
> = {
  "opos-hover": () =>
    import("@/components/docs/opos-hover").then((m) => ({
      default: m.OposHoverDocs,
    })),
  signature: () =>
    import("@/components/docs/signature").then((m) => ({
      default: m.SignatureDocs,
    })),
  "image-trail": () =>
    import("@/components/docs/image-trail").then((m) => ({
      default: m.ImageTrailDocs,
    })),
  "sticker-trail": () =>
    import("@/components/docs/sticker-trail").then((m) => ({
      default: m.StickerTrailDocs,
    })),
  "expanding-menu": () =>
    import("@/components/docs/expanding-menu").then((m) => ({
      default: m.ExpandingMenuDocs,
    })),
  "expanding-button": () =>
    import("@/components/docs/expanding-button").then((m) => ({
      default: m.ExpandingButtonDocs,
    })),
  "rich-button": () =>
    import("@/components/docs/rich-button").then((m) => ({
      default: m.RichButtonDocs,
    })),
  "bounce-sidebar": () =>
    import("@/components/docs/bounce-sidebar").then((m) => ({
      default: m.BounceSidebarDocs,
    })),
  "card-stroke": () =>
    import("@/components/docs/card-stroke").then((m) => ({
      default: m.CardStrokeDocs,
    })),
  avatar: () =>
    import("@/components/docs/avatar").then((m) => ({
      default: m.AvatarDocs,
    })),
  badge: () =>
    import("@/components/docs/badge").then((m) => ({
      default: m.BadgeDocs,
    })),
  switch: () =>
    import("@/components/docs/switch").then((m) => ({
      default: m.SwitchDocs,
    })),
  toggle: () =>
    import("@/components/docs/toggle").then((m) => ({
      default: m.ToggleDocs,
    })),
  "otp-input": () =>
    import("@/components/docs/otp-input").then((m) => ({
      default: m.OTPInputDocs,
    })),
  "smooth-input": () =>
    import("@/components/docs/smooth-input").then((m) => ({
      default: m.SmoothInputDocs,
    })),
  "elastic-slider": () =>
    import("@/components/docs/elastic-slider").then((m) => ({
      default: m.ElasticSliderDocs,
    })),
  modal: () =>
    import("@/components/docs/modal").then((m) => ({
      default: m.ModalDocs,
    })),
  drawer: () =>
    import("@/components/docs/drawer").then((m) => ({
      default: m.DrawerDocs,
    })),
  "discrete-tabs": () =>
    import("@/components/docs/discrete-tabs").then((m) => ({
      default: m.DiscreteTabsDocs,
    })),
  stepper: () =>
    import("@/components/docs/stepper").then((m) => ({
      default: m.StepperDocs,
    })),
  "dia-footer": () =>
    import("@/components/docs/dia-footer").then((m) => ({
      default: m.DiaFooterDocs,
    })),
  "image-2-gif": () =>
    import("@/components/docs/image-2-gif").then((m) => ({
      default: m.Image2GifDocs,
    })),
  "spotify-card": () =>
    import("@/components/docs/spotify-card").then((m) => ({
      default: m.SpotifyCardDocs,
    })),
  "vertical-spotify-card": () =>
    import("@/components/docs/vertical-spotify-card").then((m) => ({
      default: m.VerticalSpotifyCardDocs,
    })),
  "album-cards": () =>
    import("@/components/docs/album-cards").then((m) => ({
      default: m.AlbumCardsDocs,
    })),
  "mini-archive": () =>
    import("@/components/docs/mini-archive").then((m) => ({
      default: m.MiniArchiveDocs,
    })),
  "fan-cards": () =>
    import("@/components/docs/fan-cards").then((m) => ({
      default: m.FanCardsDocs,
    })),
  "dia-text-reveal": () =>
    import("@/components/docs/dia-text-reveal").then((m) => ({
      default: m.DiaTextRevealDocs,
    })),
  "encrypted-text": () =>
    import("@/components/docs/encrypted-text").then((m) => ({
      default: m.EncryptedTextDocs,
    })),
  "scramble-text": () =>
    import("@/components/docs/scramble-text").then((m) => ({
      default: m.ScrambleTextDocs,
    })),
  "text-roll": () =>
    import("@/components/docs/text-roll").then((m) => ({
      default: m.TextRollDocs,
    })),
  "underline-hover": () =>
    import("@/components/docs/underline-hover").then((m) => ({
      default: m.UnderlineHoverDocs,
    })),
  "wave-text": () =>
    import("@/components/docs/wave-text").then((m) => ({
      default: m.WaveTextDocs,
    })),
  "progressive-blur": () =>
    import("@/components/docs/progressive-blur").then((m) => ({
      default: m.ProgressiveBlurDocs,
    })),
  "cloud-background": () =>
    import("@/components/docs/cloud-background").then((m) => ({
      default: m.CloudBackgroundDocs,
    })),
  "curtain-background": () =>
    import("@/components/docs/curtain-background").then((m) => ({
      default: m.CurtainBackgroundDocs,
    })),
  "waves-shader-background": () =>
    import("@/components/docs/waves-shader-background").then((m) => ({
      default: m.WavesShaderBackgroundDocs,
    })),
  "accordion-reveal": () =>
    import("@/components/docs/accordion-reveal").then((m) => ({
      default: m.AccordionRevealDocs,
    })),
  "logo-cloud-001": () =>
    import("@/components/docs/logo-cloud-001").then((m) => ({
      default: m.LogoCloud001Docs,
    })),
  "logo-cloud-002": () =>
    import("@/components/docs/logo-cloud-002").then((m) => ({
      default: m.LogoCloud002Docs,
    })),
  "logo-cloud-003": () =>
    import("@/components/docs/logo-cloud-003").then((m) => ({
      default: m.LogoCloud003Docs,
    })),
  "logo-cloud-004": () =>
    import("@/components/docs/logo-cloud-004").then((m) => ({
      default: m.LogoCloud004Docs,
    })),
  "logo-cloud-005": () =>
    import("@/components/docs/logo-cloud-005").then((m) => ({
      default: m.LogoCloud005Docs,
    })),
  "logo-cloud-006": () =>
    import("@/components/docs/logo-cloud-006").then((m) => ({
      default: m.LogoCloud006Docs,
    })),
  "pricing-001": () =>
    import("@/components/docs/pricing-001").then((m) => ({
      default: m.Pricing001Docs,
    })),
  "pricing-002": () =>
    import("@/components/docs/pricing-002").then((m) => ({
      default: m.Pricing002Docs,
    })),
  "pricing-003": () =>
    import("@/components/docs/pricing-003").then((m) => ({
      default: m.Pricing003Docs,
    })),
  "pricing-004": () =>
    import("@/components/docs/pricing-004").then((m) => ({
      default: m.Pricing004Docs,
    })),
  "pricing-005": () =>
    import("@/components/docs/pricing-005").then((m) => ({
      default: m.Pricing005Docs,
    })),
  "pricing-006": () =>
    import("@/components/docs/pricing-006").then((m) => ({
      default: m.Pricing006Docs,
    })),
  "carousel-001": () =>
    import("@/components/docs/carousel-001").then((m) => ({
      default: m.Carousel001Docs,
    })),
  "carousel-002": () =>
    import("@/components/docs/carousel-002").then((m) => ({
      default: m.Carousel002Docs,
    })),
  "carousel-003": () =>
    import("@/components/docs/carousel-003").then((m) => ({
      default: m.Carousel003Docs,
    })),
  "carousel-004": () =>
    import("@/components/docs/carousel-004").then((m) => ({
      default: m.Carousel004Docs,
    })),
  "github-repo-card": () =>
    import("@/components/docs/github-repo-card").then((m) => ({
      default: m.GitHubRepoCardDocs,
    })),
  "phone-mockup": () =>
    import("@/components/docs/phone-mockup").then((m) => ({
      default: m.PhoneMockupDocs,
    })),
  "wheel-date-picker": () =>
    import("@/components/docs/wheel-date-picker").then((m) => ({
      default: m.WheelDatePickerDocs,
    })),
  "wheel-time-picker": () =>
    import("@/components/docs/wheel-time-picker").then((m) => ({
      default: m.WheelTimePickerDocs,
    })),
  "preview-rail": () =>
    import("@/components/docs/preview-rail").then((m) => ({
      default: m.PreviewRailDocs,
    })),
  "motion-accordion": () =>
    import("@/components/docs/motion-accordion").then((m) => ({
      default: m.MotionAccordionDocs,
    })),
  "bouncy-accordion": () =>
    import("@/components/docs/bouncy-accordion").then((m) => ({
      default: m.BouncyAccordionDocs,
    })),
  "line-accordion": () =>
    import("@/components/docs/line-accordion").then((m) => ({
      default: m.LineAccordionDocs,
    })),
  "video-player-001": () =>
    import("@/components/docs/video-player-001").then((m) => ({
      default: m.VideoPlayer001Docs,
    })),
  "video-player-002": () =>
    import("@/components/docs/video-player-002").then((m) => ({
      default: m.VideoPlayer002Docs,
    })),
};

export function getDocsImporter(slug: string) {
  return docsImportMap[slug] ?? null;
}

export function getDocsSlugs(): string[] {
  return Object.keys(docsImportMap);
}
