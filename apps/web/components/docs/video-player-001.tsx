import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { VideoPlayer001Preview } from "@/components/docs/previews/video-player-001-preview"

const importCode = `import { VideoPlayer001 } from "@/components/ui/video-player-001"`

const usageCode = `import { VideoPlayer001 } from "@/components/ui/video-player-001"

export default function Page() {
  return (
    <VideoPlayer001
      src="/example.mov"
      thumbnailSrc="/posters/hero.jpg"
      defaultVolume={0.8}
      ambientIntensity={0.85}
      className="w-full max-w-4xl"
    />
  )
}`

export async function VideoPlayer001Docs() {
  const sourceCode =
    (await readComponentSource("video-player-001")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      Installs{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        video-player-001.tsx
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
        Click anywhere on the frame to play or pause. On hover, a circular
        control also tracks your cursor from just below the pointer and
        crossfades between play and pause.
      </p>
      <p>
        Pass{" "}
        <code className="text-foreground">thumbnailSrc</code> for a poster that
        blur-fades in while paused and dissolves when playback starts. Set{" "}
        <code className="text-foreground">ambientIntensity</code> between{" "}
        <code className="text-foreground">0</code> and{" "}
        <code className="text-foreground">1</code> for YouTube-style ambient glow
        — sampled from the poster while paused, then from live video frames
        during playback.
      </p>
      <p>
        Need transport controls and scrubbing? See{" "}
        <Link
          href="/docs/components/video-player-002"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Video Player 002
        </Link>
        .
      </p>
    </div>
  )

  const usageCredits = (
    <p>
      Demo video served from{" "}
      <code className="text-foreground">/public/example.mov</code>. Poster
      image from{" "}
      <a
        href="https://www.cosmos.so/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline underline-offset-2"
      >
        Cosmos
      </a>
      .
    </p>
  )

  return (
    <DocsPageLayout
      title="Video Player 001"
      description="Cursor-following play control with blur-fade thumbnails and optional ambient glow."
      preview={<VideoPlayer001Preview />}
      previewCode={usageCode}
      installPackageName="video-player-001"
      installDependencies="motion @hugeicons/react @hugeicons/core-free-icons clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/video-player-001.tsx"
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
