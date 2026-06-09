import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  DiaFooterPlayground,
  DiaFooterPersonalizePanel,
} from "@/components/docs/previews/dia-footer-playground"

const importCode = `import { DiaFooter } from "@/components/ui/dia-footer"`

const usageCode = `export default function Page() {
  return (
    <DiaFooter
      theme="dia-browser"
      copyrightText={\`copyright © \${new Date().getFullYear()} — Spider UI\`}
    />
  )
}`

const themeExampleCode = `export default function Page() {
  return <DiaFooter theme="ocean" />
}`

const customColorsCode = `export default function Page() {
  return (
    <DiaFooter
      colors={{
        text: "#111827",
        gradient: [
          "#111827",
          "#1F2937",
          "#374151",
          "#4B5563",
          "#6B7280",
          "#9CA3AF",
          "#D1D5DB",
          "#F3F4F6",
        ],
      }}
    />
  )
}`

const customTextCode = `export default function Page() {
  return (
    <DiaFooter
      theme="emerald"
      copyrightText={\`copyright © \${new Date().getFullYear()} — Spider UI\`}
    />
  )
}`

export async function DiaFooterDocs() {
  const sourceCode =
    (await readComponentSource("dia-footer")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      The install command also adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        gsap
      </code>{" "}
      from the registry (includes ScrollTrigger and SplitText). Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add gsap
      </code>
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Scroll-driven footer inspired by{" "}
        <a
          href="https://www.diabrowser.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Dia Browser
        </a>
        . Uses GSAP ScrollTrigger with SplitText for the copyright reveal. Themes:{" "}
        <code className="text-foreground">dia-browser</code>,{" "}
        <code className="text-foreground">ocean</code>,{" "}
        <code className="text-foreground">amber</code>,{" "}
        <code className="text-foreground">emerald</code>,{" "}
        <code className="text-foreground">violet</code>,{" "}
        <code className="text-foreground">rose</code>.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Dia Footer"
      description="A minimal scroll-driven footer with animated spectrum bars, inspired by Dia browser."
      preview={<DiaFooterPlayground />}
      personalizeContent={<DiaFooterPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="dia-footer"
      installDependencies="gsap clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/dia-footer.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      scrollablePreview
      examples={[
        {
          title: "Ocean Theme",
          preview: <DiaFooterPlayground theme="ocean" />,
          code: themeExampleCode,
        },
        {
          title: "Custom Colors",
          preview: (
            <DiaFooterPlayground
              colors={{
                text: "#111827",
                gradient: [
                  "#111827",
                  "#1F2937",
                  "#374151",
                  "#4B5563",
                  "#6B7280",
                  "#9CA3AF",
                  "#D1D5DB",
                  "#F3F4F6",
                ],
              }}
            />
          ),
          code: customColorsCode,
        },
        {
          title: "Custom Text",
          preview: (
            <DiaFooterPlayground
              theme="emerald"
              copyrightText={`copyright © ${new Date().getFullYear()} — Spider UI`}
            />
          ),
          code: customTextCode,
        },
      ]}
      props={[
        {
          name: "theme",
          type: "DiaFooterTheme",
          default: '"dia-browser"',
          description:
            "Preset color theme for text and SVG gradient stops.",
        },
        {
          name: "colors",
          type: "{ text?: string; gradient?: string[] }",
          description:
            "Override theme with custom text color and 8 gradient stops.",
        },
        {
          name: "copyrightText",
          type: "string",
          description: "Footer copy. Defaults to current year and Spider UI.",
        },
        {
          name: "scrollContainer",
          type: "RefObject<HTMLElement | null>",
          description:
            "Optional scroll root for embedded previews. Omit for window scroll.",
        },
      ]}
    />
  )
}
