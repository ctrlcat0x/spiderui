"use client"

import { LogosCarousel } from "@workspace/ui/components/logo-cloud-003"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  LinearLogo,
  NvidiaLogo,
  StripeLogo,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-001-logos"

const logos = [
  { name: "Claude", svg: <ClaudeLogo /> },
  { name: "Nvidia", svg: <NvidiaLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Linear", svg: <LinearLogo /> },
]

export function LogoCloud003Preview() {
  return (
    <LogosCarousel
      logos={logos}
      label="Trusted by leading teams"
      count={3}
      interval={2500}
    />
  )
}
