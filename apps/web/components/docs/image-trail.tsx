import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  ImageTrailPersonalizePanel,
  ImageTrailPreview,
} from "@/components/docs/previews/image-trail-playground"

const usageCode = `import { ImageTrail } from "@/components/ui/image-trail"

const images = [
  "https://cdn.cosmos.so/your-image.webp",
  "/trail-images/2.jpg",
]

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <ImageTrail images={images} />
    </div>
  )
}`

export async function ImageTrailDocs() {
  const sourceCode =
    (await readComponentSource("image-trail")) ||
    "// Unable to load source code"

  return (
    <DocsPageLayout
      title="Image Trail"
      description="Venetian-blind cursor image trail with staggered slice reveals and smoothed pointer tracking."
      preview={<ImageTrailPreview />}
      personalizeContent={<ImageTrailPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="image-trail"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/image-trail.tsx"
      usageCode={usageCode}
      fullWidthPreview
      props={[
        {
          name: "images",
          type: "string[]",
          default: "DEFAULT_TRAIL_IMAGES",
          description: "Image URLs cycled on each spawn.",
        },
        {
          name: "imageLifespan",
          type: "number",
          default: "1000",
          description: "How long each frame stays visible before exiting (ms).",
        },
        {
          name: "minDistance",
          type: "number",
          default: "45",
          description: "Pointer travel in px before spawning the next frame.",
        },
        {
          name: "revealDuration",
          type: "number",
          default: "450",
          description: "Slice reveal animation duration (ms).",
        },
        {
          name: "fadeDuration",
          type: "number",
          default: "350",
          description: "Opacity fade duration on exit (ms).",
        },
        {
          name: "staggerDelay",
          type: "number",
          default: "30",
          description: "Delay between each slice animation (ms).",
        },
        {
          name: "lerpFactor",
          type: "number",
          default: "0.08",
          description: "Pointer smoothing strength (0–1).",
        },
        {
          name: "maxItems",
          type: "number",
          default: "8",
          description: "Maximum trail frames visible at once.",
        },
        {
          name: "slicesCount",
          type: "number",
          default: "10",
          description: "Number of mask stripes per frame.",
        },
        {
          name: "blindDirection",
          type: '"vertical" | "horizontal"',
          default: "vertical",
          description: "Slice orientation for the venetian blind reveal.",
        },
        {
          name: "itemWidth",
          type: "number",
          default: "300",
          description: "Trail frame width in pixels.",
        },
        {
          name: "itemHeight",
          type: "number",
          default: "400",
          description: "Trail frame height in pixels.",
        },
        {
          name: "desktopMinWidth",
          type: "number",
          default: "0",
          description:
            "Minimum viewport width before the effect runs (0 = always on).",
        },
        {
          name: "backgroundImage",
          type: "string",
          description: "Optional ambient background image behind the trail.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Overlay content centered above the trail layer.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the root wrapper.",
        },
      ]}
    />
  )
}
