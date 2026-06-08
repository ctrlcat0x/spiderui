import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  StickerTrailPersonalizePanel,
  StickerTrailPreview,
} from "@/components/docs/previews/sticker-trail-playground"

const importCode = `import { StickerTrail } from "@/components/ui/sticker-trail"`

const usageCode = `const stickers = ["/svgStickers/1.svg", "/svgStickers/2.svg", "/svgStickers/3.svg"]

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <StickerTrail
        data={stickers}
        renderItem={(src) => (
          <img src={src} alt="" className="size-36 object-contain" draggable={false} />
        )}
      />
    </div>
  )
}`

export async function StickerTrailDocs() {
  const sourceCode =
    (await readComponentSource("sticker-trail")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Requires{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>
      . Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add motion
      </code>
    </p>
  )

  const usageNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Inspired by{" "}
      <Link
        href="https://skiper-ui.com/v1/skiper18"
        className="font-medium text-foreground underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        Image cursor trail
      </Link>{" "}
      from{" "}
      <a
        href="https://skiper-ui.com"
        className="font-medium text-foreground underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        Skiper UI
      </a>
      . Stickers spawn, drift, and fade as the pointer moves.
    </p>
  )

  return (
    <DocsPageLayout
      title="Sticker Trail"
      description="Cursor trail of stickers that spawn, drift, and fade on pointer movement."
      preview={<StickerTrailPreview />}
      personalizeContent={<StickerTrailPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="sticker-trail"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/sticker-trail.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      fullWidthPreview
      props={[
        {
          name: "data",
          type: "T[]",
          description: "Items cycled through on each spawn.",
        },
        {
          name: "renderItem",
          type: "(item: T) => ReactNode",
          description: "Renders each spawned sticker.",
        },
        {
          name: "spawnDistance",
          type: "number",
          default: "76",
          description: "Pointer travel in px before spawning the next sticker.",
        },
        {
          name: "driftAmount",
          type: "number",
          default: "36",
          description: "How far each sticker drifts from its spawn point in px.",
        },
        {
          name: "removeDelay",
          type: "number",
          default: "1",
          description: "Seconds before a sticker is removed.",
        },
        {
          name: "maxItems",
          type: "number",
          default: "8",
          description: "Maximum stickers visible at once. Oldest are dropped when exceeded.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the trail container when not using containerRef.",
        },
        {
          name: "containerRef",
          type: "RefObject<HTMLElement>",
          description: "Optional host element for pointer tracking and positioning.",
        },
      ]}
    />
  )
}
