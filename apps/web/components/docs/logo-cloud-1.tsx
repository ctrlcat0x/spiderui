import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud1Preview } from "@/components/docs/previews/logo-cloud-1-preview"

const usageCode = `import {
  LogoCloud,
  LogoCloudGroup,
  LogoCloudItem,
} from "@/components/ui/logo-cloud-1"

export default function Page() {
  return (
    <LogoCloud label="Trusted by">
      <LogoCloudGroup>
        <LogoCloudItem icon={<YourLogo />} name="Brand" />
      </LogoCloudGroup>
    </LogoCloud>
  )
}`

export async function LogoCloud1Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-1")) ||
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
          <code className="text-foreground">LogoCloud</code> cycles through{" "}
          <code className="text-foreground">LogoCloudGroup</code> children on a timer.
        </li>
        <li>
          Each group fades out with a staggered blur effect before the next group fades in.
        </li>
        <li>
          <code className="text-foreground">LogoCloudItem</code> receives its stagger index
          automatically via <code className="text-foreground">React.cloneElement</code>.
        </li>
      </ul>
    </div>
  )

  return (
    <DocsPageLayout
      title="Logo Cloud 1"
      description="Animated logo cloud with staggered fade-in and group cycling."
      preview={<LogoCloud1Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-1"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-1.tsx"
      usageNote={usageNote}
      usageCode={usageCode}
      props={[
        {
          name: "label",
          type: "string",
          default: '""',
          description: "Optional heading displayed above the logo row.",
        },
        {
          name: "displayDuration",
          type: "number",
          default: "2000",
          description: "How long (ms) a group stays fully visible before cycling.",
        },
        {
          name: "fadeDuration",
          type: "number",
          default: "0.6",
          description: "Fade transition duration in seconds.",
        },
        {
          name: "staggerDelay",
          type: "number",
          default: "0.08",
          description: "Per-item stagger delay in seconds.",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes applied to the outer section element.",
        },
        {
          name: "icon",
          type: "ReactNode",
          description: "The logo SVG or image node (LogoCloudItem).",
        },
        {
          name: "name",
          type: "string",
          description: "Brand name displayed beside the icon (LogoCloudItem).",
        },
      ]}
    />
  )
}
