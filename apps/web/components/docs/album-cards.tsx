import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { AlbumCardsPlayground } from "@/components/docs/previews/album-cards-playground"
import { SpotifyGlobalsUsageNote } from "@/components/docs/spotify-globals-styles-note"

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
      title="Album Cards"
      description="A stacked row of Spotify album covers that eject a spinning vinyl disc on click, with hover lift, neighbor dimming, and reflections."
      preview={<AlbumCardsPlayground />}
      previewCode={usageCode}
      installPackageName="album-cards"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/album-cards.tsx"
      installationNote={installationNote}
      usageNote={<SpotifyGlobalsUsageNote />}
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
