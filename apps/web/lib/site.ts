export const siteUrl = "https://spiderui.dev"

export const ogImage = {
  path: "/og.png",
  width: 1200,
  height: 630,
  alt: "Spider UI — Handcrafted components for the web",
  type: "image/png" as const,
}

export const ogImageUrl = `${siteUrl}${ogImage.path}`

export const openGraphImages = [
  {
    url: ogImageUrl,
    width: ogImage.width,
    height: ogImage.height,
    alt: ogImage.alt,
    type: ogImage.type,
  },
] as const
