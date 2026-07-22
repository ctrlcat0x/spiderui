import {
  VestaboardPersonalizePanel,
  VestaboardPlayground,
} from "@/components/docs/previews/vestaboard-playground";
import { DocsPageLayout } from "@/components/docs-page-layout";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import {
  Vestaboard,
  VESTABOARD_COLOR_TOKENS,
} from "@/components/ui/vestaboard"`;

const usageCode = `export function Demo() {
  return (
    <Vestaboard
      text={"STATUS {orange} SHIPPED\\nTHIS WEEK"}
      rows={6}
      columns={22}
      flipSpeed={160}
      colorTokens={VESTABOARD_COLOR_TOKENS}
      colors={{
        board: "#171717",
        flap: "#262626",
        text: "#fafafa",
      }}
    />
  )
}`;

export async function VestaboardDocs() {
  const sourceCode =
    (await readComponentSource("vestaboard")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Vestaboard"
      description="Mechanical split-flap display with recessed two-part panels, automatic text wrapping, optional color tiles, and character-wheel animation."
      preview={<VestaboardPlayground />}
      personalizeContent={<VestaboardPersonalizePanel />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="vestaboard"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/vestaboard.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "text",
          type: "string",
          default: '"WHAT DID YOU GET DONE\\nTHIS WEEK?"',
          description: "Message to wrap and center on the board.",
        },
        {
          name: "rows",
          type: "number",
          default: "6",
          description: "Board row count, clamped between 1 and 10.",
        },
        {
          name: "columns",
          type: "number",
          default: "22",
          description: "Board column count, clamped between 4 and 32.",
        },
        {
          name: "flipSpeed",
          type: "number",
          default: "160",
          description: "Milliseconds for each physical character-wheel step.",
        },
        {
          name: "colorTokens",
          type: "Record<string, string>",
          description:
            "Optional named color flaps. Use them in text as {orange}, {green}, and similar tokens.",
        },
        {
          name: "colors.board",
          type: "string",
          default: '"#171717"',
          description: "Board enclosure color.",
        },
        {
          name: "colors.flap",
          type: "string",
          default: '"#262626"',
          description: "Default letter panel color.",
        },
        {
          name: "colors.text",
          type: "string",
          default: '"#fafafa"',
          description: "Printed character color.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the board enclosure.",
        },
      ]}
    />
  );
}
