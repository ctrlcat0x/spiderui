import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { AlbumCardsPlayground } from "@/components/docs/previews/album-cards-playground"
import { SpotifyGlobalsStylesNote } from "@/components/docs/spotify-globals-styles-note"

const usageCode = `import { AlbumCards } from "@/components/ui/album-cards"

const albums = [
  { id: "1", url: "https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ" },
  { id: "2", url: "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2" },
  { id: "3", url: "https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX" },
]

export default function Page() {
  return <AlbumCards albums={albums} />
}`

export async function AlbumCardsDocs() {
  const sourceCode =
    (await readComponentSource("album-cards")) ||
    "// Unable to load source code"

  const installationNote = (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <p>
        Requires{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          GET /api/spotify?url=
        </code>
        . See the{" "}
        <a href="/docs/components/spotify-card" className="text-foreground underline">
          Spotify Card
        </a>{" "}
        docs for API setup.
      </p>
      <code className="block rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
        pnpm add spotify-url-info
      </code>
      <SpotifyGlobalsStylesNote uses="spin" />
    </div>
  )

  const usageNote = (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Each card fetches track art via your API route. Click a cover to eject a
        spinning vinyl SVG; only one disc stays open at a time. Neighbor cards
        dim slightly when another is active.
      </p>
      <SpotifyGlobalsStylesNote uses="spin" />
    </div>
  )

  return (
    <DocsPageLayout
      title="Album Cards"
      description="A stacked row of Spotify album covers that eject a spinning vinyl disc on click, with hover lift, neighbor dimming, and reflections."
      preview={<AlbumCardsPlayground />}
      previewCode={usageCode}
      installPackageName="album-cards"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/album-cards.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "albums",
          type: "AlbumCardData[]",
          description:
            "Album entries with a unique id and Spotify track URL.",
        },
        {
          name: "title",
          type: "string",
          default: `"Music I'm Vibin' to"`,
          description: "Optional label (reserved for custom layouts).",
        },
        {
          name: "apiPath",
          type: "string",
          default: '"/api/spotify"',
          description: "API route used to fetch track metadata.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the outer wrapper.",
        },
      ]}
    />
  )
}
