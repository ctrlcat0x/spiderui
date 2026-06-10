"use client"

import {
  Analytics01Icon,
  ComputerTerminal01Icon,
  Database01Icon,
  FileSecurityIcon,
  GithubIcon,
  Globe02Icon,
  SquareLock02Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type Plan6Feature = {
  text: string
  icon: IconSvgElement
}

export type Plan6 = {
  id: string
  name: string
  price: string
  priceNote?: string
  features: Plan6Feature[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  featuredLabel?: string
}

export const DEFAULT_PLANS_6: Plan6[] = [
  {
    id: "open-source",
    name: "Open Source",
    price: "0$",
    priceNote: "forever",
    features: [
      {
        icon: Database01Icon,
        text: "Self-host on your own infrastructure",
      },
      {
        icon: FileSecurityIcon,
        text: "Full access to the Scalar CMS core",
      },
      {
        icon: GithubIcon,
        text: "GitHub community support",
      },
      {
        icon: ComputerTerminal01Icon,
        text: "Ideal for developers and internal tools",
      },
    ],
    ctaLabel: "View on GitHub",
    ctaHref: "#",
  },
  {
    id: "cloud",
    name: "Cloud",
    price: "From $29",
    priceNote: "month",
    featured: true,
    featuredLabel: "Most popular",
    features: [
      {
        icon: Database01Icon,
        text: "Fully managed infrastructure",
      },
      {
        icon: UserMultiple02Icon,
        text: "Realtime collaboration & autosave",
      },
      {
        icon: SquareLock02Icon,
        text: "Role-based access & team permissions",
      },
      {
        icon: Globe02Icon,
        text: "Built-in CDN for media delivery",
      },
      {
        icon: Analytics01Icon,
        text: "Email support & usage analytics",
      },
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "#",
  },
]

function FeatureRow({ feature }: { feature: Plan6Feature }) {
  return (
    <li className="flex items-start gap-3">
      <HugeiconsIcon
        icon={feature.icon}
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
      />
      <span className="text-sm leading-relaxed text-muted-foreground">
        {feature.text}
      </span>
    </li>
  )
}

function PlanColumn({
  plan,
  ctaVariant,
}: {
  plan: Plan6
  ctaVariant: "default" | "secondary"
}) {
  return (
    <div className="relative flex flex-col gap-8 p-8 sm:p-10 lg:p-12">
      {plan.featured && plan.featuredLabel ? (
        <span className="absolute top-0 right-0 rounded-none bg-blue-600 px-2.5 py-1 text-sm font-medium text-white">
          {plan.featuredLabel}
        </span>
      ) : null}

      <div className="space-y-3">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-2 text-lg sm:text-xl">
          <span className="font-medium tracking-tight">{plan.price}</span>
          {plan.priceNote ? (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{plan.priceNote}</span>
            </>
          ) : null}
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-4">
        {plan.features.map((feature) => (
          <FeatureRow key={feature.text} feature={feature} />
        ))}
      </ul>

      <Button variant={ctaVariant} className="w-fit" asChild>
        <a href={plan.ctaHref}>{plan.ctaLabel}</a>
      </Button>
    </div>
  )
}

export interface Pricing006Props {
  plans?: Plan6[]
  title?: string
  className?: string
}

export function Pricing006({
  plans = DEFAULT_PLANS_6,
  title = "Start free. Scale confidently.",
  className,
}: Pricing006Props) {
  const [leftPlan, rightPlan] = plans

  return (
    <section className={cn("mx-auto w-full max-w-5xl", className)}>
      <div className="overflow-hidden rounded-sm border border-border">
        <header className="border-b border-border px-8 py-8 sm:px-10 sm:py-10 lg:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </header>

        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {leftPlan ? (
            <PlanColumn plan={leftPlan} ctaVariant="secondary" />
          ) : null}
          {rightPlan ? (
            <PlanColumn plan={rightPlan} ctaVariant="default" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
