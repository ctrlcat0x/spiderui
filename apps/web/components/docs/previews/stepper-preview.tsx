"use client";

import { useState } from "react";

import { Stepper, type StepperStep } from "@workspace/ui/components/stepper";

export function StepperPreview() {
  const [complete, setComplete] = useState(false);
  const [details, setDetails] = useState({
    name: "Acme Studio",
    email: "billing@acme.co",
    vat: "",
  });

  const steps: StepperStep[] = [
    {
      id: "workspace",
      label: "Workspace details",
      content: (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 font-medium">
            Workspace name
            <input
              value={details.name}
              onChange={(event) =>
                setDetails((value) => ({
                  ...value,
                  name: event.target.value,
                }))
              }
              className="h-10 rounded-xl border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>
      ),
    },
    {
      id: "billing",
      label: "Billing details",
      content: (
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between gap-4 rounded-xl bg-muted/55 px-4 py-3">
            <span>Invoice email</span>
            <input
              type="email"
              value={details.email}
              onChange={(event) =>
                setDetails((value) => ({
                  ...value,
                  email: event.target.value,
                }))
              }
              className="min-w-0 flex-1 bg-transparent text-right text-muted-foreground outline-none focus:text-foreground"
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-xl bg-muted/55 px-4 py-3">
            <span>VAT number</span>
            <input
              value={details.vat}
              placeholder="Not set"
              onChange={(event) =>
                setDetails((value) => ({
                  ...value,
                  vat: event.target.value,
                }))
              }
              className="min-w-0 flex-1 bg-transparent text-right text-muted-foreground outline-none placeholder:text-muted-foreground focus:text-foreground"
            />
          </label>
        </div>
      ),
    },
    {
      id: "review",
      label: "Review workspace",
      content: (
        <dl className="flex flex-col gap-3">
          <div className="flex justify-between gap-4 rounded-xl bg-muted/55 px-4 py-3">
            <dt>Workspace</dt>
            <dd className="text-muted-foreground">{details.name}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-xl bg-muted/55 px-4 py-3">
            <dt>Invoice email</dt>
            <dd className="text-muted-foreground">{details.email}</dd>
          </div>
        </dl>
      ),
    },
  ];

  return (
    <div className="flex min-h-[560px] w-full items-center justify-center px-6 py-12">
      <Stepper
        steps={steps}
        defaultIndex={1}
        complete={complete}
        height={220}
        finishLabel="Create workspace"
        completeLabel="Workspace created"
        onComplete={() => setComplete(true)}
        className="max-w-xl"
      />
    </div>
  );
}
