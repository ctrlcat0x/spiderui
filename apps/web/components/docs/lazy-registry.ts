import type React from "react";

const docsImportMap: Record<
  string,
  () => Promise<
    | { default: React.ComponentType<Record<string, unknown>> }
    | { [key: string]: React.ComponentType<Record<string, unknown>> }
  >
> = {
  "collection-surfer": () =>
    import("@/components/docs/collection-surfer").then((m) => ({
      default: m.CollectionSurferDocs,
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
  "card-stroke": () =>
    import("@/components/docs/card-stroke").then((m) => ({
      default: m.CardStrokeDocs,
    })),
  avatar: () =>
    import("@/components/docs/avatar").then((m) => ({
      default: m.AvatarDocs,
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
};

export function getDocsImporter(slug: string) {
  return docsImportMap[slug] ?? null;
}

export function getDocsSlugs(): string[] {
  return Object.keys(docsImportMap);
}
