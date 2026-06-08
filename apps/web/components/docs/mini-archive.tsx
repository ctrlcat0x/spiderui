import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  MiniArchivePlayground,
  MiniArchivePersonalizePanel,
} from "@/components/docs/previews/mini-archive-playground"

const importCode = `import { MiniArchive } from "@/components/ui/mini-archive"`

const usageCode = `export default function Page() {
  return (
    <MiniArchive
      title="集めたもの"
      subtitle="Mini Archive"
      accentColor="orange"
    />
  )
}`

export async function MiniArchiveDocs() {
  const sourceCode =
    (await readComponentSource("mini-archive")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        A 3D glassmorphism folder that hinges open on click, revealing quote
        cards side by side with spring motion. Hover for a subtle peek; click
        outside to close. Use the personalize panel to tweak colors and cover
        text. Design inspired by{" "}
        <a
          href="https://x.com/AdityaSur11/status/2038111406219043004"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Aditya Sur
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Mini Archive"
      description="A 3D glass folder with hinged cover, frosted blur, and quote cards that fan out on open."
      preview={<MiniArchivePlayground />}
      personalizeContent={<MiniArchivePersonalizePanel />}
      previewCode={usageCode}
      installPackageName="mini-archive"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/mini-archive.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "title",
          type: "string",
          default: '"集めたもの"',
          description: "Primary label on the front cover.",
        },
        {
          name: "subtitle",
          type: "string",
          default: '"Mini Archive"',
          description: "Secondary label below the title.",
        },
        {
          name: "accentColor",
          type: '"yellow" | "pink" | "cyan" | "violet" | "orange" | "emerald" | "black"',
          default: '"orange"',
          description: "Folder tint for the glass cover and back panel.",
        },
        {
          name: "quotes",
          type: "[MiniArchiveQuote, MiniArchiveQuote]",
          description:
            "Pair of quote cards revealed inside the folder. Defaults to two funny movie lines.",
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
