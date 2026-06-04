import type React from "react";

const docsImportMap: Record<
  string,
  () => Promise<
    | { default: React.ComponentType<Record<string, unknown>> }
    | { [key: string]: React.ComponentType<Record<string, unknown>> }
  >
> = {
  "weeeee-hover": () =>
    import("@/components/docs/weeeee-hover").then((m) => ({
      default: m.WeeeeeHoverDocs,
    })),
  "scroll-split-card": () =>
    import("@/components/docs/scroll-split-card").then((m) => ({
      default: m.ScrollSplitCardDocs,
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
  footer: () =>
    import("@/components/docs/footer").then((m) => ({
      default: m.FooterDocs,
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
  "logo-cloud-1": () =>
    import("@/components/docs/logo-cloud-1").then((m) => ({
      default: m.LogoCloud1Docs,
    })),
  "logo-cloud-2": () =>
    import("@/components/docs/logo-cloud-2").then((m) => ({
      default: m.LogoCloud2Docs,
    })),
  "logo-cloud-3": () =>
    import("@/components/docs/logo-cloud-3").then((m) => ({
      default: m.LogoCloud3Docs,
    })),
  "logo-cloud-4": () =>
    import("@/components/docs/logo-cloud-4").then((m) => ({
      default: m.LogoCloud4Docs,
    })),
  "pricing-1": () =>
    import("@/components/docs/pricing-1").then((m) => ({
      default: m.Pricing1Docs,
    })),
  "pricing-2": () =>
    import("@/components/docs/pricing-2").then((m) => ({
      default: m.Pricing2Docs,
    })),
  "pricing-3": () =>
    import("@/components/docs/pricing-3").then((m) => ({
      default: m.Pricing3Docs,
    })),
  "pricing-4": () =>
    import("@/components/docs/pricing-4").then((m) => ({
      default: m.Pricing4Docs,
    })),
  "pricing-5": () =>
    import("@/components/docs/pricing-5").then((m) => ({
      default: m.Pricing5Docs,
    })),
};

export function getDocsImporter(slug: string) {
  return docsImportMap[slug] ?? null;
}

export function getDocsSlugs(): string[] {
  return Object.keys(docsImportMap);
}
