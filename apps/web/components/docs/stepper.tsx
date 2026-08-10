import { DocsPageLayout } from "@/components/docs-page-layout";
import { StepperPreview } from "@/components/docs/previews/stepper-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { Stepper, type StepperStep } from "@/components/ui/stepper"`;

const usageCode = `export function WorkspaceOnboarding() {
  const [complete, setComplete] = useState(false)

  const steps: StepperStep[] = [
    { id: "profile", label: "Your profile", content: <ProfileForm /> },
    { id: "team", label: "Invite your team", content: <InviteForm /> },
    { id: "review", label: "Review", content: <Review /> },
  ]

  return (
    <Stepper
      steps={steps}
      complete={complete}
      height={220}
      finishLabel="Create workspace"
      onComplete={() => setComplete(true)}
    />
  )
}`;

export async function StepperDocs() {
  const sourceCode =
    (await readComponentSource("stepper")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Stepper"
      description="An accessible multi-step flow with controlled or uncontrolled state, visited-step navigation, keyboard controls, spring progress, directional panel transitions, and a completion state."
      preview={<StepperPreview />}
      previewCode={usageCode}
      installPackageName="stepper"
      installDependencies="motion lucide-react clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/stepper.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "steps",
          type: "readonly StepperStep[]",
          description: "Ordered labels and panel content for the flow.",
        },
        {
          name: "index",
          type: "number",
          description: "Controlled active step index.",
        },
        {
          name: "defaultIndex",
          type: "number",
          default: "0",
          description: "Initial step for uncontrolled usage.",
        },
        {
          name: "onIndexChange",
          type: "(index: number, direction: 1 | -1) => void",
          description: "Called when a step change is requested.",
        },
        {
          name: "onComplete",
          type: "() => void",
          description: "Called when the final action is pressed.",
        },
        {
          name: "complete",
          type: "boolean",
          default: "false",
          description: "Displays completed rail and confirmation panel.",
        },
        {
          name: "height",
          type: "number | string",
          default: "184",
          description: "Sets a stable panel height during transitions.",
        },
        {
          name: "backLabel",
          type: "string",
          default: '"Back"',
          description: "Back action label.",
        },
        {
          name: "nextLabel",
          type: "string",
          default: '"Next"',
          description: "Intermediate forward action label.",
        },
        {
          name: "finishLabel",
          type: "string",
          default: '"Finish"',
          description: "Final forward action label.",
        },
        {
          name: "label",
          type: "string",
          default: '"Steps"',
          description: "Accessible name for the progress rail.",
        },
        {
          name: "panelClassName",
          type: "string",
          description: "Classes applied to the content panel.",
        },
      ]}
    />
  );
}
