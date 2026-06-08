import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Avatar } from "@workspace/ui/components/avatar"
import {
  AvatarPlayground,
  AvatarPersonalizePanel,
} from "@/components/docs/previews/avatar-playground"

const importCode = `import { Avatar } from "@/components/ui/avatar"`

const usageCode = `export default function Page() {
  return <Avatar color="blue" size="md" shape="circle" />
}`

const shapesExampleCode = `import { Avatar } from "@/components/ui/avatar"

export default function Page() {
  return (
    <div className="flex items-center gap-4">
      <Avatar color="pink" size="md" shape="square" />
      <Avatar color="blue" size="md" shape="circle" />
      <Avatar color="green" size="md" shape="squircle" />
    </div>
  )
}`

const sizesExampleCode = `import { Avatar } from "@/components/ui/avatar"

export default function Page() {
  return (
    <div className="flex items-end gap-4">
      <Avatar color="purple" size="sm" />
      <Avatar color="purple" size="md" />
      <Avatar color="purple" size="lg" />
    </div>
  )
}`

const noBlinkCode = `import { Avatar } from "@/components/ui/avatar"

export default function Page() {
  return <Avatar color="cyan" blinking={false} />
}`

export async function AvatarDocs() {
  const sourceCode =
    (await readComponentSource("avatar")) || "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      The install command also adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>{" "}
      from the registry. Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add motion
      </code>
    </p>
  )



  return (
    <DocsPageLayout
      title="Avatar"
      description="Animated AI orb with blinking eyes, twelve color presets, three sizes, and circle, square, or squircle shapes. Inspired by Kimi AI."
      preview={<AvatarPlayground />}
      personalizeContent={<AvatarPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="avatar"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/avatar.tsx"
      installationNote={installationNote}
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Shapes",
          preview: <AvatarPlayground layout="shapes" />,
          code: shapesExampleCode,
        },
        {
          title: "Sizes",
          preview: (
            <div className="flex h-full w-full items-end justify-center gap-4 p-8">
              <Avatar color="purple" size="sm" />
              <Avatar color="purple" size="md" />
              <Avatar color="purple" size="lg" />
            </div>
          ),
          code: sizesExampleCode,
        },
        {
          title: "No Blink",
          preview: (
            <AvatarPlayground
              config={{
                color: "cyan",
                size: "md",
                shape: "circle",
                blinking: false,
              }}
            />
          ),
          code: noBlinkCode,
        },
      ]}
      props={[
        {
          name: "color",
          type: "AvatarColor",
          default: '"blue"',
          description:
            "Orb color — blue, orange, red, green, purple, yellow, cyan, pink, indigo, lime, turquoise, or violet.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: 'Size preset — "sm", "md", or "lg".',
        },
        {
          name: "shape",
          type: '"circle" | "square" | "squircle"',
          default: '"circle"',
          description: 'Shape — "circle", "square", or "squircle".',
        },
        {
          name: "blinking",
          type: "boolean",
          default: "true",
          description: "Enable the looping eye-blink animation.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the outer motion div.",
        },
      ]}
    />
  )
}
