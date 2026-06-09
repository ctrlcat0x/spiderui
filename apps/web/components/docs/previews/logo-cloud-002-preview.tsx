"use client"

import { LogoCloud002 } from "@workspace/ui/components/logo-cloud-002"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  NvidiaLogo,
  StripeLogoApp,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-001-logos"

const logos = [
  { name: "Claude", svg: <ClaudeLogo /> },
  { name: "Nvidia", svg: <NvidiaLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
  { name: "Stripe", svg: <StripeLogoApp /> },
  { name: "Vercel", svg: <VercelLogo /> },
]

export function LogoCloud002Preview() {
  return <LogoCloud002 logos={logos} label="Trusted by teams using" />
}
