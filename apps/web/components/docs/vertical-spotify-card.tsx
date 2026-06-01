import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { VerticalSpotifyCardPlayground } from "@/components/docs/previews/vertical-spotify-card-playground"
import { SpotifyGlobalsUsageNote } from "@/components/docs/spotify-globals-styles-note"

const usageCode = `import { VerticalSpotifyCard } from "@/components/ui/vertical-spotify-card"

export default function Page() {
  return (
    <VerticalSpotifyCard url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ" />
  )
}`

const playlistCode = `import { useState } from "react"
import { VerticalSpotifyCard } from "@/components/ui/vertical-spotify-card"

const TRACKS = [
  "https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ",
  "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2",
]

export default function Page() {
  const [index, setIndex] = useState(0)

  return (
    <VerticalSpotifyCard
      url={TRACKS[index]}
      onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      onNext={
        index < TRACKS.length - 1 ? () => setIndex((i) => i + 1) : undefined
      }
    />
  )
}`

export async function VerticalSpotifyCardDocs() {
  const sourceCode =
    (await readComponentSource("vertical-spotify-card")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm text-muted-foreground">
      Uses{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        /api/spotify
      </code>
      . Set up the route on the{" "}
      <Link href="/docs/components/spotify-card" className="text-foreground underline">
        Spotify Card
      </Link>{" "}
      page.
    </p>
  )

  return (
    <DocsPageLayout
      title="Vertical Spotify Card"
      description="A tall vertical Spotify card with progressive blur album art, seek bar, and transport controls."
      preview={<VerticalSpotifyCardPlayground />}
      previewCode={usageCode}
      installPackageName="vertical-spotify-card"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/vertical-spotify-card.tsx"
      installationNote={installationNote}
      usageNote={<SpotifyGlobalsUsageNote />}
      usageCode={usageCode}
      examples={[
        {
          title: "With Prev / Next",
          preview: <VerticalSpotifyCardPlayground />,
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
