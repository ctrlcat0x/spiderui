import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { VideoPlayer002Preview } from "@/components/docs/previews/video-player-002-preview"

const importCode = `import { VideoPlayer002 } from "@/components/ui/video-player-002"`

const usageCode = `import { VideoPlayer002 } from "@/components/ui/video-player-002"

export default function Page() {
  return (
    <VideoPlayer002
      src="/example.mov"
      thumbnailSrc="/posters/hero.jpg"
      defaultVolume={0.8}
      ambientIntensity={0.85}
      className="w-full max-w-4xl"
    />
  )
}`

export async function VideoPlayer002Docs() {
  const sourceCode =
    (await readComponentSource("video-player-002")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Installs{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        video-player-002.tsx
      </code>{" "}
      and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        video-player-shared.tsx
      </code>
      . Requires{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>
      ,{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        @hugeicons/react
      </code>
      , and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        @hugeicons/core-free-icons
      </code>
      .
    </p>
  )

  const usageNote = (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
      <p>
        A complete inline player for hero sections and case-study embeds. While
        paused, a centered play button sits over the poster or last frame. On
        play, a control bar slides up from the bottom with play/pause, a
        scrubbable progress track, and a volume slider on the right.
      </p>
      <p>
        Shares the same{" "}
        <code className="text-foreground">thumbnailSrc</code> blur-fade behavior
        and{" "}
        <code className="text-foreground">ambientIntensity</code> glow as{" "}
        <Link
          href="/docs/components/video-player-001"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Video Player 001
        </Link>
        — poster colors while paused, video frames while playing. Place the
        player on a dark surface when using ambient lighting so the bleed reads
        clearly.
      </p>
    </div>
  )

  const usageCredits = (
    <p>
      Demo video served from{" "}
      <code className="text-foreground">/public/example.mov</code>.
    </p>
  )

  return (
    <DocsPageLayout
      title="Video Player 002"
      description="Full inline player with centered play, sliding controls, scrubber, volume, and ambient glow."
      preview={<VideoPlayer002Preview />}
      previewCode={usageCode}
      installPackageName="video-player-002"
      installDependencies="motion @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/video-player-002.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      usageCredits={usageCredits}
      fullWidthPreview
      props={[
        {
          name: "src",
          type: "string",
          default: "DEFAULT_VIDEO_PLAYER_SRC",
          description: "Video file URL. Supports mp4, mov, and other browser-native formats.",
        },
        {
          name: "thumbnailSrc",
          type: "string",
          description:
            "Optional poster image shown while paused. Blur-fades in on pause and out on play.",
        },
        {
          name: "defaultVolume",
          type: "number",
          default: "1",
          description: "Initial volume from 0 (muted) to 1 (full).",
        },
        {
          name: "ambientIntensity",
          type: "number",
          default: "0",
          description:
            "Ambient glow from 0 (off) to 1 (max). Samples the poster while paused, then live video frames during playback.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the outer frame wrapper.",
        },
      ]}
    />
  )
}
