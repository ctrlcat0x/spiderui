export const siteUrl = "https://spiderui.dev"

export const ogImage = {
  path: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Spider UI — Handcrafted components for the web",
  type: "image/jpeg" as const,
}

/** Relative path — resolved via metadataBase in layout metadata. */
export const ogImageUrl = ogImage.path

export const openGraphImages = [
  {
    url: ogImage.path,
    width: ogImage.width,
    height: ogImage.height,
    alt: ogImage.alt,
    type: ogImage.type,
  },
] as const
