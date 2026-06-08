import React from "react"
import Link from "next/link"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Download } from "lucide-react"
import {
  SignaturePlayground,
  SignaturePersonalizePanel,
  SignatureColorPreview,
} from "@/components/docs/previews/signature-playground"

const importCode = `import { Signature } from "@/components/ui/signature"`

const usageCode = `export default function Page() {
  return <Signature text="Spider UI" fontSize={48} />
}`

const colorExampleCode = `export default function Page() {
  return <Signature text="Spider UI" fontSize={48} color="#3b82f6" />
}`

export async function SignatureDocs() {
  const sourceCode =
    (await readComponentSource("signature")) || "// Unable to load source code"

  const installationNote = (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Place{" "}
        <span
          className="font-medium text-foreground"
        >
          LastoriaBoldRegular.otf
        </span>{" "}
        in your{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          public
        </code>{" "}
        directory, or pass a custom path via{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          fontUrl
        </code>
        .
      </p>
      <a
        href="/LastoriaBoldRegular.otf"
        download="LastoriaBoldRegular.otf"
        className="inline-flex w-fit items-center gap-2 rounded-md border border-border/70 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        <Download className="size-3.5" aria-hidden />
        Download LastoriaBoldRegular.otf
      </a>
    </div>
  )

  return (
    <DocsPageLayout
      title="Signature"
      description="Animated SVG signature that traces text with OpenType.js paths and Motion stroke reveals."
      preview={<SignaturePlayground />}
      personalizeContent={<SignaturePersonalizePanel />}
      previewCode={usageCode}
      installPackageName="signature"
      installDependencies="motion opentype.js"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/signature.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Color",
          preview: <SignatureColorPreview />,
          code: colorExampleCode,
        },
      ]}
      props={[
        {
          name: "text",
          type: "string",
          default: '"Signature"',
          description: "Text converted into handwriting paths.",
        },
        {
          name: "color",
          type: "string",
          description:
            "Stroke and fill color. Omit to inherit theme foreground via currentColor.",
        },
        {
          name: "fontSize",
          type: "number",
          default: "14",
          description: "Font size used while converting glyphs to paths.",
        },
        {
          name: "duration",
          type: "number",
          default: "1.5",
          description: "Animation duration in seconds for each character.",
        },
        {
          name: "delay",
          type: "number",
          default: "0",
          description: "Delay before the first character starts animating.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the SVG element.",
        },
        {
          name: "inView",
          type: "boolean",
          default: "false",
          description: "Animate only when the element enters the viewport.",
        },
        {
          name: "once",
          type: "boolean",
          default: "true",
          description: "Play the in-view animation only once.",
        },
        {
          name: "fontUrl",
          type: "string",
          description: "Custom font URL. Defaults to /LastoriaBoldRegular.otf.",
        },
      ]}
    />
  )
}
