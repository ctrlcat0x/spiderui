import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud005Preview } from "@/components/docs/previews/logo-cloud-005-preview"

const importCode = `import { LogoCloud005 } from "@/components/ui/logo-cloud-005"`

const usageCode = `import { LogoCloud005 } from "@/components/ui/logo-cloud-005"
import { StripeLogo, TrelloLogo } from "./logos"

export default function Page() {
  return (
    <LogoCloud005
      title={["Trusted by experts", "on the web."]}
      rows={[
        [
          { name: "TRELLO", est: "EST. 2011", logo: <TrelloLogo /> },
          { name: "STRIPE", est: "EST. 2010", logo: <StripeLogo /> },
        ],
      ]}
    />
  )
}`

export async function LogoCloud005Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-005")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Pass any number of rows with up to four logos each. Logos render in
        grayscale until hovered — then brand color returns, the cell background
        lifts to muted, sibling cells dim, and the company name plus established
        date appear in the top-left and bottom-right corners.
      </p>
      <p>
        Bring your own SVGs or images.{" "}
        <a
          href="https://svgl.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          svgl
        </a>{" "}
        is a good source for brand marks.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 005"
      description="Bordered logo grid with grayscale-to-color hover, dimmed siblings, and company metadata reveal."
      preview={<LogoCloud005Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-005"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-005.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      fullWidthPreview
      props={[
        {
          name: "title",
          type: "string | string[]",
          description:
            "Optional heading above the grid. Pass an array for multi-line titles with muted second lines. On hover, company name shows top-left and est. date bottom-right.",
        },
        {
          name: "rows",
          type: "LogoCloud005Row[]",
          description:
            "Array of rows. Each row is an array of up to four logo items.",
        },
        {
          name: "dimOpacity",
          type: "number",
          default: "0.45",
          description: "Opacity applied to non-hovered cells while one is active.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the root section.",
        },
      ]}
    />
  )
}
