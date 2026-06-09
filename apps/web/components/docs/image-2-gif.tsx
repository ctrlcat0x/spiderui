import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Image2GifPreview } from "@/components/docs/previews/image-2-gif-preview"

const importCode = `import { Image2Gif } from "@/components/ui/image-2-gif"`

const usageCode = `const frames = [
  "/frames/01.jpg",
  "/frames/02.jpg",
  "/frames/03.jpg",
]

export default function Page() {
  return (
    <div className="relative aspect-video w-full max-w-md">
      <Image2Gif images={frames} interval={200} className="size-full object-cover" />
    </div>
  )
}`

export async function Image2GifDocs() {
  const sourceCode =
    (await readComponentSource("image-2-gif")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Cycles through a list of image URLs like a GIF — preload all frames,
        then advance on an interval. Supports custom renderers for{" "}
        <code className="text-foreground">next/image</code>, one-shot playback,
        and loading placeholders.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Image 2 Gif"
      description="Frame-sequence player that turns a list of still images into a looping GIF-like animation."
      preview={<Image2GifPreview />}
      previewCode={usageCode}
      installPackageName="image-2-gif"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/image-2-gif.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "images",
          type: "string[]",
          description: "Ordered frame URLs to cycle through.",
        },
        {
          name: "interval",
          type: "number",
          default: "500",
          description: "Milliseconds between frame advances.",
        },
        {
          name: "loop",
          type: "boolean",
          default: "true",
          description: "Restart from the first frame after the last.",
        },
        {
          name: "onComplete",
          type: "() => void",
          description: "Called once when loop is false and the last frame is reached.",
        },
        {
          name: "renderImage",
          type: "(src: string, index: number) => ReactNode",
          description: "Custom frame renderer — e.g. next/image with fill.",
        },
        {
          name: "renderLoading",
          type: "() => ReactNode",
          description: "Placeholder shown while frames preload.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the default img element or loading skeleton.",
        },
      ]}
    />
  )
}
