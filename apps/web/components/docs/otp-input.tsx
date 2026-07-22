import { DocsPageLayout } from "@/components/docs-page-layout";
import { OTPInputPreview } from "@/components/docs/previews/otp-input-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { OTPInput, OTPInputSlots } from "@/components/ui/otp-input"`;

const usageCode = `export function VerificationCode() {
  return (
    <OTPInput
      length={6}
      label="Verification code"
      description="Enter the code sent to your device."
      onValueComplete={(code) => console.log(code)}
    >
      <OTPInputSlots separatorAfter={3} />
    </OTPInput>
  )
}`;

const maskedCode = `<OTPInput length={6} mask label="Secure code">
  <OTPInputSlots separatorAfter={3} />
</OTPInput>`;

const invalidCode = `<OTPInput
  length={6}
  invalid
  label="Verification code"
  errorMessage="That code has expired. Request a new one."
>
  <OTPInputSlots separatorAfter={3} />
</OTPInput>`;

export async function OTPInputDocs() {
  const sourceCode =
    (await readComponentSource("otp-input")) || "// Unable to load source code";

  return (
    <DocsPageLayout
      title="OTP Input"
      description="Accessible verification-code slots built on Base UI with grouped separators, masking, validation states, and reduced-motion support."
      preview={<OTPInputPreview />}
      previewCode={usageCode}
      installPackageName="otp-input"
      installDependencies="@base-ui/react motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/otp-input.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      examples={[
        {
          title: "Masked",
          preview: (
            <div className="flex h-full w-full items-center justify-center p-8">
              <OTPInputPreview variant="masked" />
            </div>
          ),
          code: maskedCode,
        },
        {
          title: "Invalid",
          preview: (
            <div className="flex h-full w-full items-center justify-center p-8">
              <OTPInputPreview variant="invalid" />
            </div>
          ),
          code: invalidCode,
        },
      ]}
      props={[
        {
          name: "length",
          type: "number",
          default: "6",
          description: "Number of input slots, clamped from 1 to 12.",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled OTP value.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial value for an uncontrolled OTP input.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called whenever the normalized value changes.",
        },
        {
          name: "onValueComplete",
          type: "(value: string) => void",
          description: "Called when every slot is filled.",
        },
        {
          name: "validationType",
          type: '"numeric" | "alphanumeric" | "alpha"',
          default: '"numeric"',
          description: "Characters accepted by the field.",
        },
        {
          name: "mask",
          type: "boolean",
          default: "false",
          description: "Replace entered characters with dots.",
        },
        {
          name: "separatorAfter",
          type: "number | readonly number[]",
          description: "Slot positions where OTPInputSlots inserts separators.",
        },
        {
          name: "size",
          type: '"sm" | "default"',
          default: '"default"',
          description: "Slot size preset.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description: "Apply invalid styling and accessibility state.",
        },
        {
          name: "label",
          type: "ReactNode",
          description: "Accessible field label.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Help text linked to the field.",
        },
        {
          name: "errorMessage",
          type: "ReactNode",
          description:
            "Accessible error text that also marks the field invalid.",
        },
      ]}
    />
  );
}
