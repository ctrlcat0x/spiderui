import { DocsPageLayout } from "@/components/docs-page-layout";
import { WheelDatePickerPreview } from "@/components/docs/previews/wheel-date-picker-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { WheelDatePicker } from "@/components/ui/wheel-date-picker"`;

const usageCode = `export function Demo() {
  return (
    <WheelDatePicker
      defaultValue={new Date(2026, 6, 21)}
      minYear={1900}
      maxYear={2050}
      onChange={(date) => console.log(date)}
    />
  )
}`;

export async function WheelDatePickerDocs() {
  const sourceCode =
    (await readComponentSource("wheel-date-picker")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Wheel Date Picker"
      description="An inertial month, day, and year picker with cylindrical depth, spring snapping, and keyboard control."
      preview={<WheelDatePickerPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="wheel-date-picker"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/wheel-date-picker.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "value",
          type: "Date",
          description: "Controlled selected date.",
        },
        {
          name: "defaultValue",
          type: "Date",
          description: "Initial date for uncontrolled usage.",
        },
        {
          name: "onChange",
          type: "(value: Date) => void",
          description: "Called as a wheel crosses into a new value.",
        },
        {
          name: "minYear",
          type: "number",
          default: "1900",
          description: "Earliest selectable year.",
        },
        {
          name: "maxYear",
          type: "number",
          default: "2050",
          description: "Latest selectable year.",
        },
        {
          name: "locale",
          type: "string",
          description: "Locale used to format month labels.",
        },
        {
          name: "monthFormat",
          type: '"long" | "short" | "numeric"',
          default: '"long"',
          description: "Month label style.",
        },
        {
          name: "itemHeight",
          type: "number",
          default: "44",
          description: "Height of each wheel step in pixels.",
        },
        {
          name: "visibleCount",
          type: "3 | 5 | 7",
          default: "5",
          description: "Number of visible rows.",
        },
        {
          name: "lens",
          type: "boolean",
          default: "true",
          description: "Show the centered selection lens.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable pointer, wheel, and keyboard input.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the picker frame.",
        },
      ]}
    />
  );
}
