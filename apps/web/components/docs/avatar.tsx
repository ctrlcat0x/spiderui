import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import { Avatar } from "@workspace/ui/components/avatar"
import {
  AvatarPlayground,
  AvatarPersonalizePanel,
} from "@/components/docs/previews/avatar-playground"

const usageCode = `import { Avatar } from "@/components/ui/avatar"

export default function Page() {
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

  const usageNote = (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        The orb uses <strong className="text-foreground">Motion</strong>{" "}
        for squash-and-stretch on tap, CSS keyframes for blinking eyes, and SVG{" "}
        <code className="text-foreground">feTurbulence</code> filters for noise and
        grain. No image assets required.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Avatar"
      description="An animated AI orb avatar with blinking eyes, 12 color presets, 3 sizes, and 3 shapes."
      preview={<AvatarPlayground />}
      personalizeContent={<AvatarPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="avatar"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/avatar.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
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
            'Colour theme: blue, orange, red, green, purple, yellow, cyan, pink, indigo, lime, turquoise, violet.',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Orb size.",
        },
        {
          name: "shape",
          type: '"circle" | "square" | "squircle"',
          default: '"circle"',
          description: "Border-radius shape of the orb.",
        },
        {
          name: "blinking",
          type: "boolean",
          default: "true",
          description: "Whether the eyes use the blink animation loop.",
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
