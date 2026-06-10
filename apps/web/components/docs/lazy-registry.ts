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
  "scrub-input": () =>
    import("@/components/docs/scrub-input").then((m) => ({
      default: m.ScrubInputDocs,
    })),
  "signature": () =>
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
  "dia-footer": () =>
    import("@/components/docs/dia-footer").then((m) => ({
      default: m.DiaFooterDocs,
    })),
  "image-2-gif": () =>
    import("@/components/docs/image-2-gif").then((m) => ({
      default: m.Image2GifDocs,
    })),
  "greeting-preloader": () =>
    import("@/components/docs/greeting-preloader").then((m) => ({
      default: m.GreetingPreloaderDocs,
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
  "contribution-graph": () =>
    import("@/components/docs/contribution-graph").then((m) => ({
      default: m.ContributionGraphDocs,
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
