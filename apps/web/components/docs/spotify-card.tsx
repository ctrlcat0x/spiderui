import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { SPOTIFY_API_ROUTE_CODE } from "@/lib/spotify-api-route"
import { SpotifyCardPlayground } from "@/components/docs/previews/spotify-card-playground"
import { CodeBlock } from "@/components/code-block"

const importCode = `import { SpotifyCard } from "@/components/ui/spotify-card"`

const usageCode = `export default function Page() {
  return (
    <SpotifyCard
      url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
      size="lg"
    />
  )
}`

const playlistCode = `import { useState } from "react"

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
    <p className="text-sm text-muted-foreground">
      Run{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add spotify-url-info
      </code>{" "}
      and add the API route below.
    </p>
  )

  const afterApiReference = (
    <section className="space-y-4 pt-10">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        API route
      </h2>
      <p className="text-sm text-muted-foreground">
        Copy into{" "}
        <code className="text-foreground">app/api/spotify/route.ts</code>:
      </p>
      <div className="relative overflow-hidden rounded-xl border border-border bg-zinc-100 dark:bg-zinc-900/50">
        <CodeBlock
          code={SPOTIFY_API_ROUTE_CODE}
          lang="tsx"
          className="border-none !bg-transparent shadow-none !rounded-none [&_pre]:!overflow-x-auto"
        />
      </div>
    </section>
  )

  return (
    <DocsPageLayout
      title="Spotify Card"
      description="Horizontal Spotify card with blurred album art, spinning vinyl, seek bar, and playback controls."
      preview={<SpotifyCardPlayground />}
      previewCode={usageCode}
      installPackageName="spotify-card"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/spotify-card.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      afterApiReference={afterApiReference}
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
