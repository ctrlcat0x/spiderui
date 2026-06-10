import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud006Preview } from "@/components/docs/previews/logo-cloud-006-preview"

const importCode = `import { LogoCloud006 } from "@/components/ui/logo-cloud-006"`

const usageCode = `import { LogoCloud006 } from "@/components/ui/logo-cloud-006"
import { StripeLogo, TrelloLogo } from "./logos"

export default function Page() {
  return (
    <LogoCloud006
      title={[
        "Worked with",
        "Top companies in the world who saw potential in us",
      ]}
      rows={[
        [
          {
            name: "Trello",
            logo: <TrelloLogo />,
            href: "/case-studies/trello",
          },
          {
            name: "Stripe",
            logo: <StripeLogo />,
            href: "/case-studies/stripe",
          },
        ],
      ]}
    />
  )
}`

export async function LogoCloud006Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-006")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Up to four logos per row on a bordered grid. Logos stay full color — on
        hover the cell background shifts to muted, the logo hides, and a case
        study link appears centered. Pass an array for multi-line titles with a
        muted second line, same as Logo Cloud 005.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 006"
      description="Case-study logo grid with hover-to-reveal study links."
      preview={<LogoCloud006Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-006"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-006.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      fullWidthPreview
      props={[
        {
          name: "title",
          type: "string | string[]",
          description:
            "Optional heading above the grid. Pass an array for multi-line titles with muted second lines.",
        },
        {
          name: "rows",
          type: "LogoCloud006Row[]",
          description:
            "Array of rows with up to four logo items each.",
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
