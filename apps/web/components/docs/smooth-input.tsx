import { DocsPageLayout } from "@/components/docs-page-layout";
import { SmoothInputPreview } from "@/components/docs/previews/smooth-input-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { SmoothInput } from "@/components/ui/smooth-input"`;

const usageCode = `export function ProfileFields() {
  const [title, setTitle] = useState("Designing better interfaces")

  return (
    <SmoothInput
      label="Title"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      description="Used as the public page title."
    />
  )
}`;

const invalidCode = `<SmoothInput
  label="Title"
  invalid
  errorMessage="A title is required."
/>`;

export async function SmoothInputDocs() {
  const sourceCode =
    (await readComponentSource("smooth-input")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Smooth Input"
      description="A polished text field with a spring-following caret, stable measurement, controlled or uncontrolled state, and accessible help and error text."
      preview={<SmoothInputPreview />}
      previewCode={usageCode}
      installPackageName="smooth-input"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/smooth-input.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Invalid",
          preview: <SmoothInputPreview invalid />,
          code: invalidCode,
        },
      ]}
      props={[
        {
          name: "value",
          type: "string | number",
          description: "Controlled input value.",
        },
        {
          name: "defaultValue",
          type: "string | number",
          description: "Initial uncontrolled value.",
        },
        {
          name: "label",
          type: "ReactNode",
          description: "Accessible label linked to the field.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Help text linked with aria-describedby.",
        },
        {
          name: "errorMessage",
          type: "ReactNode",
          description: "Accessible error text that marks the field invalid.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description: "Applies invalid styling and aria-invalid.",
        },
        {
          name: "inputClassName",
          type: "string",
          description:
            "Styles shared by the input and caret measurement layer.",
        },
        {
          name: "caretClassName",
          type: "string",
          description: "Styles the animated caret.",
        },
        {
          name: "containerClassName",
          type: "string",
          description: "Styles the outer field container.",
        },
      ]}
    />
  );
}
