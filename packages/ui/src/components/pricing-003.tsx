"use client"

import {
  Coins01Icon,
  MoneyBag01Icon,
  SecurityCheckIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type Plan3 = {
  id: string
  name: string
  price?: string
  priceNote?: string
  customPricing?: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  featuredLabel?: string
  footerNote?: string
}

export const DEFAULT_PLANS_3: Plan3[] = [
  {
    id: "hobby",
    name: "Hobby",
    price: "Free",
    description: "For most individuals",
    features: [
      "Up to 3 Blog posts",
      "Up to 3 Transcriptions",
      "Up to 3 Posts stored",
      "Markdown support",
      "Community support",
      "AI powered suggestions",
    ],
    ctaLabel: "Start For Free",
    ctaHref: "#",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20",
    priceNote: "per month",
    description: "For small businesses",
    features: [
      "Up to 500 Blog Posts",
      "Up to 500 Transcriptions",
      "Up to 500 Posts stored",
      "Unlimited Markdown support",
      "SEO optimization tools",
      "Priority support",
      "AI powered suggestions",
    ],
    ctaLabel: "Get started",
    ctaHref: "#",
    featured: true,
    featuredLabel: "Best Value",
    footerNote: "Safe and secure",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    customPricing: "Tailored pricing terms",
    description: "For large organizations",
    features: [
      "Unlimited Blog Posts",
      "Unlimited Transcriptions",
      "Unlimited Posts stored",
      "Unlimited Markdown support",
      "SEO optimization tools",
      "Priority support",
      "AI powered suggestions",
    ],
    ctaLabel: "Contact team",
    ctaHref: "#",
  },
]

export const DEFAULT_PRICING_3_SUBTITLE =
  "Use Inbox individually or upgrade to link more accounts and add seats for your team members."

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2.5 text-sm">
          <HugeiconsIcon
            icon={Tick02Icon}
            className="size-4 shrink-0 text-foreground/60"
            strokeWidth={2}
          />
          {feature}
        </li>
      ))}
    </ul>
  )
}

function resolvePlans(plans: Plan3[]) {
  const featuredPlan = plans.find((p) => p.featured)
  const nonFeatured = plans.filter((p) => !p.featured)
  const hobbyPlan = nonFeatured[0]
  const enterprisePlan = nonFeatured[1] ?? nonFeatured[0]

  return { hobbyPlan, featuredPlan, enterprisePlan }
}

export interface Pricing003Props {
  plans?: Plan3[]
  title?: string
  subtitle?: string
  className?: string
}

export function Pricing003({
  plans = DEFAULT_PLANS_3,
  title = "Flexible plans that grow with you",
  subtitle = DEFAULT_PRICING_3_SUBTITLE,
  className,
}: Pricing003Props) {
  const { hobbyPlan, featuredPlan, enterprisePlan } = resolvePlans(plans)

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16">
        <h2 className="text-4xl font-bold tracking-tight md:max-w-xs">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground md:max-w-xs">
          {subtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border md:grid md:grid-cols-3">
        {hobbyPlan ? (
          <div className="flex flex-col gap-6 border-b border-border p-6 md:border-r md:border-b-0">
            <span className="text-sm text-muted-foreground">
              {hobbyPlan.name}
            </span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight">
                  {hobbyPlan.price}
                </span>
                {hobbyPlan.priceNote ? (
                  <span className="text-sm text-muted-foreground">
                    {hobbyPlan.priceNote}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {hobbyPlan.description}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href={hobbyPlan.ctaHref}>{hobbyPlan.ctaLabel}</a>
            </Button>
            <FeatureList features={hobbyPlan.features} />
          </div>
        ) : null}

        {featuredPlan ? (
          <div className="flex flex-col items-stretch gap-4 border-b border-border bg-muted/50 p-1.5 md:border-r md:border-b-0">
            <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 dark:shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {featuredPlan.name}
                </span>
                {featuredPlan.featuredLabel ? (
                  <Badge variant="amber">
                    <HugeiconsIcon icon={MoneyBag01Icon} strokeWidth={3} />
                    <span className="text-xs font-semibold">
                      {featuredPlan.featuredLabel}
                    </span>
                  </Badge>
                ) : null}
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight">
                    {featuredPlan.price}
                  </span>
                  {featuredPlan.priceNote ? (
                    <span className="text-sm text-muted-foreground">
                      {featuredPlan.priceNote}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {featuredPlan.description}
                </p>
              </div>
              <Button asChild className="w-full">
                <a href={featuredPlan.ctaHref}>{featuredPlan.ctaLabel}</a>
              </Button>
              <FeatureList features={featuredPlan.features} />
            </div>
            {featuredPlan.footerNote ? (
              <div className="flex items-center justify-center gap-1.5 pb-2 text-xs text-muted-foreground">
                <HugeiconsIcon
                  icon={SecurityCheckIcon}
                  className="size-3 shrink-0"
                  strokeWidth={3}
                />
                {featuredPlan.footerNote}
              </div>
            ) : null}
          </div>
        ) : null}

        {enterprisePlan ? (
          <div className="flex flex-col gap-6 p-6">
            <span className="text-sm text-muted-foreground">
              {enterprisePlan.name}
            </span>
            <div>
              {enterprisePlan.customPricing ? (
                <>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <HugeiconsIcon
                      icon={Coins01Icon}
                      className="size-4 shrink-0"
                      strokeWidth={2}
                    />
                    {enterprisePlan.customPricing}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {enterprisePlan.description}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight">
                      {enterprisePlan.price}
                    </span>
                    {enterprisePlan.priceNote ? (
                      <span className="text-sm text-muted-foreground">
                        {enterprisePlan.priceNote}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {enterprisePlan.description}
                  </p>
                </>
              )}
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href={enterprisePlan.ctaHref}>{enterprisePlan.ctaLabel}</a>
            </Button>
            <FeatureList features={enterprisePlan.features} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
