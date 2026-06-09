import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { LogoCloud001Preview } from "@/components/docs/previews/logo-cloud-001-preview"

const importCode = `import {
  LogoCloud,
  LogoCloudGroup,
  LogoCloudItem,
} from "@/components/ui/logo-cloud-001"`

const usageCode = `export default function Page() {
  return (
    <LogoCloud label="Trusted by">
      <LogoCloudGroup>
        <LogoCloudItem icon={<VercelLogo />} name="Vercel" />
        <LogoCloudItem icon={<StripeLogo />} name="Stripe" />
        <LogoCloudItem icon={<ClerkLogo />} name="Clerk" />
      </LogoCloudGroup>
      <LogoCloudGroup>
        <LogoCloudItem icon={<LinearLogo />} name="Linear" />
        <LogoCloudItem icon={<BoltLogo />} name="Bolt" />
      </LogoCloudGroup>
    </LogoCloud>
  )
}`

export async function LogoCloud001Docs() {
  const sourceCode =
    (await readComponentSource("logo-cloud-001")) ||
    "// Unable to load source code"

  const usageNote = (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Compose one or more <code className="text-foreground">LogoCloudGroup</code>{" "}
        children. The cloud cycles groups on a timer with staggered blur fade-out and
        fade-in per item. Bring your own SVGs —{" "}
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
      title="Logo Cloud 001"
      description="Composable logo cloud with grouped children, staggered blur fades, and automatic group cycling."
      preview={<LogoCloud001Preview />}
      previewCode={usageCode}
      installPackageName="logo-cloud-001"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/logo-cloud-001.tsx"
      usageNote={usageNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "label",
          type: "string",
          default: '""',
          description: "Optional heading above the logo row (LogoCloud).",
        },
        {
          name: "displayDuration",
          type: "number",
          default: "2000",
          description: "Milliseconds each group stays visible before cycling (LogoCloud).",
        },
        {
          name: "fadeDuration",
          type: "number",
          default: "0.6",
          description: "Fade transition duration in seconds (LogoCloud).",
        },
        {
          name: "staggerDelay",
          type: "number",
          default: "0.08",
          description: "Per-item stagger delay in seconds (LogoCloud).",
        },
        {
          name: "className",
          type: "string",
          description: "Classes on the outer section (LogoCloud).",
        },
        {
          name: "icon",
          type: "ReactNode",
          description: "Logo SVG or image node (LogoCloudItem).",
        },
        {
          name: "name",
          type: "string",
          description: "Brand label beside the icon (LogoCloudItem).",
        },
      ]}
    />
  )
}
