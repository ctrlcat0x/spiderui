import { DocsPageLayout } from "@/components/docs-page-layout";
import { ProgressiveBlurPreview } from "@/components/docs/previews/progressive-blur-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { ProgressiveBlur } from "@/components/ui/progressive-blur"`;

const usageCode = `export default function Page() {
  return (
    <div className="relative h-[400px] overflow-y-auto bg-background">
      <div className="mx-auto max-w-lg space-y-6 px-6 py-12 text-muted-foreground">
        <p>Scrollable content</p>
        <p>Content remains clear until it reaches the edge.</p>
        <p>The blur creates a softer handoff to the container.</p>
      </div>

      <ProgressiveBlur
        position="both"
        height="28%"
        backgroundColor="var(--background)"
      />
    </div>
  )
}`;

export async function ProgressiveBlurDocs() {
  const sourceCode =
    (await readComponentSource("progressive-blur")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Progressive Blur"
      description="A lightweight scroll-edge primitive that dissolves content into its surface with a continuous, layered backdrop blur."
      preview={<ProgressiveBlurPreview />}
      previewCode={usageCode}
      installPackageName="progressive-blur"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/progressive-blur.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      usageNote={
        <p className="text-sm leading-relaxed text-muted-foreground">
          Make the scroll container <code>relative</code>, then render{" "}
          <code>ProgressiveBlur</code>
          after its content so the edge stays on top.
        </p>
      }
      props={[
        {
          name: "position",
          type: '"top" | "bottom" | "both"',
          default: '"bottom"',
          description:
            "Choose the edge where scrolling content should dissolve.",
        },
        {
          name: "height",
          type: "string",
          default: '"30%"',
          description: "CSS height of each edge treatment.",
        },
        {
          name: "backgroundColor",
          type: "string",
          default: '"transparent"',
          description:
            "Match this to the scroll container background for a seamless fade.",
        },
        {
          name: "blurLevels",
          type: "readonly number[]",
          default: "[0.5, 1, 2, 4, 8, 16, 32, 64]",
          description:
            "Blur radii in pixels, ordered from content side to edge.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes applied to the absolute overlay.",
        },
      ]}
      afterApiReference={
        <div className="rounded-xl border border-border/50 bg-muted/20 p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Surface matching</p>
          <p className="mt-2">
            Set <code>backgroundColor</code> to the scrolling surface color. The
            fade then absorbs the final blurred pixels without a visible edge.
          </p>
        </div>
      }
    />
  );
}
