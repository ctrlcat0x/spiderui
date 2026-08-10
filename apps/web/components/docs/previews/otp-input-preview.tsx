"use client";

import { useState } from "react";

import { OTPInput, OTPInputSlots } from "@workspace/ui/components/otp-input";

export function OTPInputPreview({
  variant = "default",
}: {
  variant?: "default" | "masked" | "invalid";
}) {
  const [value, setValue] = useState("");
  const invalid = variant === "invalid";

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center px-5 py-14">
      <div className="w-full max-w-lg">
        <OTPInput
          value={value}
          onValueChange={setValue}
          length={6}
          mask={variant === "masked"}
          invalid={invalid}
          label={variant === "masked" ? "Secure code" : "Verification code"}
          errorMessage={
            invalid ? "That code has expired. Request a new one." : undefined
          }
          description={
            invalid
              ? undefined
              : value.length === 6
                ? "Code ready to verify."
                : "Enter the code sent to your device."
          }
        >
          <OTPInputSlots separatorAfter={3} />
        </OTPInput>
      </div>
    </div>
  );
}
