"use client"

import { LogoCloud2 } from "@workspace/ui/components/logo-cloud-2"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  NvidiaLogo,
  StripeLogoApp,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-1-logos"

const logos = [
  { name: "Claude", svg: <ClaudeLogo /> },
  { name: "Nvidia", svg: <NvidiaLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
  { name: "Stripe", svg: <StripeLogoApp /> },
  { name: "Vercel", svg: <VercelLogo /> },
]

export function LogoCloud2Preview() {
  return <LogoCloud2 logos={logos} label="Trusted by teams using" />
}
