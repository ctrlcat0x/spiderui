"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type Plan4 = {
  id: string
  name: string
  features: string[]
  originalPrice?: string
  price: string
  ctaLabel: string
  ctaHref: string
  recommended?: boolean
  recommendedLabel?: string
  billingNote?: string
  accent?:
    | "neutral"
    | "orange"
    | "blue"
    | "violet"
    | "emerald"
    | "rose"
    | "yellow"
}

export const DEFAULT_PLANS_4: Plan4[] = [
  {
    id: "lifetime",
    name: "Lifetime",
    features: [
      "All features (non-cloud)",
      "Unlimited organization",
      "1-year feature updates",
    ],
    originalPrice: "$89",
    price: "$59",
    ctaLabel: "Purchase",
    ctaHref: "/checkout/lifetime",
    accent: "neutral",
  },
  {
    id: "pro-plus",
    name: "Pro+",
    features: [
      "Cross-sync up to 3 devices",
      "Upload to cloud link",
      "Share cloud links",
      "All feature updates",
    ],
    originalPrice: "$8",
    price: "$6/month",
    ctaLabel: "Start free trial",
    ctaHref: "/checkout/pro",
    recommended: true,
    recommendedLabel: "Recommended",
    accent: "yellow",
  },
]

const accentIcon: Record<NonNullable<Plan4["accent"]>, string> = {
  neutral:
    "bg-linear-to-b from-zinc-300 to-zinc-500 dark:from-zinc-500 dark:to-zinc-700",
  orange: "bg-linear-to-b from-orange-400 to-red-600",
  blue: "bg-linear-to-b from-sky-300 to-blue-600",
  violet: "bg-linear-to-b from-violet-400 to-purple-700",
  emerald: "bg-linear-to-b from-emerald-300 to-teal-600",
  rose: "bg-linear-to-b from-rose-300 to-pink-700",
  yellow: "bg-linear-to-b from-yellow-300 to-amber-600",
}

export interface Pricing4Props {
  plans?: Plan4[]
  title?: string
  subtitle?: string
  className?: string
}

export function Pricing4({
  plans = DEFAULT_PLANS_4,
  title = "Organize without limits",
  subtitle = "Local or cloud — your choice",
  className,
}: Pricing4Props) {
  return (
    <div className={cn("w-full space-y-8", className)}>
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-stretch"
          >
            <div className="flex flex-1 flex-col gap-12">
              <div
                className={cn(
                  "size-9 shrink-0 rounded-full border border-zinc-950/10 shadow-md ring-1 shadow-zinc-950/20 ring-white/30 ring-inset dark:border-white/10",
                  accentIcon[plan.accent ?? "neutral"],
                )}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.recommended ? (
                    <Badge variant="secondary" className="text-xs">
                      {plan.recommendedLabel ?? "Recommended"}
                    </Badge>
                  ) : null}
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start justify-between gap-4 sm:items-end">
              <div className="flex items-baseline gap-2">
                {plan.originalPrice ? (
                  <span className="text-base text-muted-foreground line-through">
                    {plan.originalPrice}
                  </span>
                ) : null}
                <span className="text-2xl font-bold tracking-tight">
                  {plan.price}
                </span>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <Button
                  className="rounded-full border border-zinc-950/25 bg-linear-to-t from-primary to-primary/85 px-6 shadow-md ring-1 shadow-zinc-950/20 ring-white/20 transition-[filter] duration-200 ring-inset hover:brightness-110 active:brightness-90 dark:border-white/20 dark:ring-transparent"
                  asChild
                >
                  <a href={plan.ctaHref}>{plan.ctaLabel}</a>
                </Button>
                {plan.billingNote ? (
                  <p className="text-xs text-muted-foreground">
                    {plan.billingNote}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
