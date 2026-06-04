import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud4Preview } from "@/components/docs/previews/logo-cloud-4-preview"

const usageCode = `import { LogoMarquee } from "@/components/ui/logo-cloud-4"

const logos = [
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

const marqueePrimitiveCode = `import { Marquee } from "@/components/ui/logo-cloud-4"

<Marquee direction="left" duration={30} gap={64} pauseOnHover fade>
  <img src="/logo-a.svg" alt="Brand A" />
  <img src="/logo-b.svg" alt="Brand B" />
</Marquee>`

export async function LogoCloud4Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-4")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>
          For provider icons, use{" "}
          <a
            href="https://svgl.app/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-2"
          >
            svgl
          </a>{" "}
          — a library of SVG logos for popular brands and services.
        </p>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code className="text-foreground">Marquee</code> renders each logo twice for a seamless CSS loop.
        </li>
        <li>Four directional keyframes support horizontal and vertical scrolling.</li>
        <li>
          A <code className="text-foreground">mask-image</code> gradient fades the leading and trailing edges.
        </li>
        <li>Hover pauses the animation via <code className="text-foreground">animation-play-state</code>.</li>
      </ul>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Marquee primitive</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs">
          <code>{marqueePrimitiveCode}</code>
        </pre>
      </div>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 4"
      description="CSS marquee logo cloud with configurable direction, speed, gap, and gradient fade edges."
      preview={<LogoCloud4Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-4"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-4.tsx"
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "logos",
          type: "LogoCloud4Item[]",
          description: "Array of logo items to display.",
        },
        {
          name: "label",
          type: "string",
          description: "Optional heading displayed above the marquee.",
        },
        {
          name: "duration",
          type: "number",
          default: "20",
          description: "Duration of one full scroll cycle in seconds.",
        },
        {
          name: "gap",
          type: "number",
          default: "80",
          description: "Pixel gap between each logo.",
        },
        {
          name: "reverse",
          type: "boolean",
          default: "false",
          description: "Scroll right instead of left.",
        },
        {
          name: "pauseOnHover",
          type: "boolean",
          default: "true",
          description: "Pause the marquee when the user hovers over it.",
        },
        {
          name: "fade",
          type: "boolean",
          default: "true",
          description: "Apply gradient fade masks on the leading and trailing edges.",
        },
        {
          name: "fadeAmount",
          type: "number",
          default: "10",
          description:
            "Percentage of the container width/height used for each fade edge.",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes applied to the outer section element.",
        },
      ]}
    />
  )
}
