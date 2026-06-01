import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { SpotifyCardPlayground } from "@/components/docs/previews/spotify-card-playground"
import { SpotifyGlobalsStylesNote } from "@/components/docs/spotify-globals-styles-note"

const usageCode = `import { SpotifyCard } from "@/components/ui/spotify-card"

export default function Page() {
  return (
    <SpotifyCard
      url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
      size="lg"
    />
  )
}`

const playlistCode = `import { useState } from "react"
import { SpotifyCard } from "@/components/ui/spotify-card"

const TRACKS = [
  "https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ",
  "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2",
]

export default function Page() {
  const [index, setIndex] = useState(0)

  return (
    <SpotifyCard
      url={TRACKS[index]}
      size="lg"
      className="w-80"
      onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      onNext={
        index < TRACKS.length - 1 ? () => setIndex((i) => i + 1) : undefined
      }
    />
  )
}`

export async function SpotifyCardDocs() {
  const sourceCode =
    (await readComponentSource("spotify-card")) ||
    "// Unable to load source code"

  const installationNote = (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <p>
        This component calls{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          GET /api/spotify?url=
        </code>
        . Add the API route and dependency in your Next.js app:
      </p>
      <code className="block rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
        pnpm add spotify-url-info
      </code>
      <p className="text-xs">
        Copy{" "}
        <code className="text-foreground">app/api/spotify/route.ts</code> from the
        Spider UI docs app, or use the snippet in the usage note below.
      </p>
      <SpotifyGlobalsStylesNote uses="seek-and-spin" />
    </div>
  )

  const usageNote = (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Fetches track metadata and preview audio via your API route. Album art
        blurs as the background; the vinyl slides out on play.
      </p>
      <SpotifyGlobalsStylesNote uses="seek-and-spin" />
      <p className="pt-2">API route example:</p>
      <pre className="overflow-x-auto rounded-md bg-zinc-950/90 p-3 text-xs text-zinc-100">
        {`// app/api/spotify/route.ts
import { NextRequest, NextResponse } from "next/server"
import spotifyUrlInfo from "spotify-url-info"

const { getPreview } = spotifyUrlInfo(fetch)

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }
  try {
    const data = await getPreview(url.replace(/\\/intl-[a-z]{2}\\//, "/"))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}`}
      </pre>
    </div>
  )

  return (
    <DocsPageLayout
      title="Spotify Card"
      description="A horizontal Spotify music card with blurred album art, animated vinyl, seek bar, and playback controls."
      preview={<SpotifyCardPlayground />}
      previewCode={usageCode}
      installPackageName="spotify-card"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/spotify-card.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      examples={[
        {
          title: "With Prev / Next",
          preview: <SpotifyCardPlayground />,
          code: playlistCode,
        },
      ]}
      props={[
        {
          name: "url",
          type: "string",
          description: "Full Spotify track URL.",
        },
        {
          name: "size",
          type: '"md" | "lg" | "xl"',
          default: '"md"',
          description: "Card size variant.",
        },
        {
          name: "apiPath",
          type: "string",
          default: '"/api/spotify"',
          description: "API route used to fetch track preview data.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the card wrapper.",
        },
        {
          name: "onPrev",
          type: "() => void",
          description: "Previous track handler. Disables button when omitted.",
        },
        {
          name: "onNext",
          type: "() => void",
          description: "Next track handler. Disables button when omitted.",
        },
      ]}
    />
  )
}
