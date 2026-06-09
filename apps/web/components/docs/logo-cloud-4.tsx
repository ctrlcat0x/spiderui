import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  LogoCloud4Preview,
  MarqueePrimitivePreview,
} from "@/components/docs/previews/logo-cloud-4-preview"

const importCode = `import { LogoMarquee } from "@/components/ui/logo-cloud-4"`

const usageCode = `const logos = [
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
]

export default function Page() {
  return (
    <LogoMarquee
      logos={logos}
      label="Used by modern companies"
      duration={40}
      gap={200}
    />
  )
}`

const marqueeExampleCode = `export default function Page() {
  return (
    <Marquee direction="left" duration={30} gap={64} pauseOnHover fade>
      <img src="/logo-a.svg" alt="Brand A" className="h-8" />
      <img src="/logo-b.svg" alt="Brand B" className="h-8" />
    </Marquee>
  )
}`

const marqueeImportCode = `import { Marquee } from "@/components/ui/logo-cloud-4"`

export async function LogoCloud4Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-4")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        <code className="text-foreground">LogoMarquee</code> wraps the lower-level{" "}
        <code className="text-foreground">Marquee</code> primitive with a label and logo
        list. The track duplicates children for a seamless CSS loop, supports four
        scroll directions, and optional edge fades via{" "}
        <code className="text-foreground">mask-image</code>.
      </p>
      <p>
        Brand SVGs:{" "}
        <a
          href="https://svgl.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          svgl
        </a>
        .
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 4"
      description="Infinite CSS marquee for logos with gradient edge fades, hover pause, and a reusable Marquee primitive."
      preview={<LogoCloud4Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-4"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-4.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Marquee primitive",
          preview: <MarqueePrimitivePreview />,
          code: `${marqueeImportCode}\n\n${marqueeExampleCode}`,
        },
      ]}
      props={[
        {
          name: "logos",
          type: "LogoCloud4Item[]",
          description: "Logo entries for LogoMarquee.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional heading above the marquee (LogoMarquee).",
        },
        {
          name: "duration",
          type: "number",
          default: "20",
          description: "Full scroll cycle duration in seconds.",
        },
        {
          name: "gap",
          type: "number",
          default: "80",
          description: "Pixel gap between logos (LogoMarquee default 80, Marquee default 32).",
        },
        {
          name: "reverse",
          type: "boolean",
          default: "false",
          description: "Scroll right instead of left (LogoMarquee).",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "true",
          description: "Pause on hover (LogoMarquee). Marquee primitive defaults to false.",
        },
        {
          name: "fade",
          type: "boolean",
          default: "true",
          description: "Gradient fade on leading/trailing edges.",
        },
        {
          name: "fadeAmount",
          type: "number",
          default: "10",
          description: "Percentage of container used for each fade edge.",
        },
        {
          name: "direction",
          type: '"left" | "right" | "up" | "down"',
          default: '"left"',
          description: "Scroll direction (Marquee).",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the outer section or marquee container.",
        },
      ]}
    />
  )
}
