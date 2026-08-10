"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, Diamond } from "lucide-react";
import {
  DiaFooter,
  DIA_FOOTER_THEMES,
  type DiaFooterColorProps,
  type DiaFooterTheme,
} from "@workspace/ui/components/dia-footer";
import { cn } from "@/lib/utils";
import {
  type DiaFooterConfig,
  usePlaygroundStore,
} from "@/hooks/use-playground-store";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    {children}
  </div>
);

type DiaFooterPlaygroundProps = {
  config?: DiaFooterConfig;
  theme?: DiaFooterTheme;
  copyrightText?: string;
  colors?: DiaFooterColorProps;
};

const FOOTER_LINKS = [
  {
    title: "Product",
    links: ["Overview", "Features", "Integrations", "Pricing", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "API reference", "Support", "Status"],
  },
  { title: "Company", links: ["About", "Careers", "Blog", "Press", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

export function DiaFooterPlayground({
  config: configOverride,
  theme,
  copyrightText,
  colors,
}: DiaFooterPlaygroundProps) {
  const emailId = useId();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [scrollerReady, setScrollerReady] = useState(false);
  const storeConfig = usePlaygroundStore((state) => state.diaFooterConfig);
  const config = configOverride ?? storeConfig;
  const resolvedTheme = theme ?? config.theme;
  const resolvedCopy = copyrightText ?? config.copyrightText;
  const remountKey = `${resolvedTheme}-${resolvedCopy}-${colors ? "custom" : "preset"}`;

  const handleRootRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      setScrollerReady(false);
      scrollContainerRef.current = null;
      return;
    }

    const scroller = node.closest<HTMLElement>("[data-docs-preview-scroll]");
    scrollContainerRef.current = scroller;
    scroller?.scrollTo({ top: 0 });
    setScrollerReady(Boolean(scroller));
  }, []);

  useLayoutEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [remountKey]);

  return (
    <div ref={handleRootRef} className="w-full">
      <div className="flex min-h-[58svh] flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Scroll down to reveal
        </span>
        <ArrowDown className="size-4 text-muted-foreground" aria-hidden />
      </div>

      {scrollerReady ? (
        <DiaFooter
          key={remountKey}
          theme={resolvedTheme}
          copyrightText={resolvedCopy}
          colors={colors}
          scrollContainer={scrollContainerRef}
          gradientHeight="42svh"
          contentClassName="@container mx-auto w-full max-w-6xl px-6 pt-12 sm:px-8"
        >
          <div className="grid gap-12 pb-12 @min-[900px]:grid-cols-6">
            <div className="@min-[900px]:col-span-2">
              <div className="flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white">
                <Diamond className="size-4 fill-current" aria-hidden />
                Lumen Studio
              </div>
              <p className="mt-5 max-w-md text-[15px] leading-6 text-zinc-400">
                Design tooling for teams who ship on Fridays. Built for the
                browser, offline by default.
              </p>
              <form
                className="mt-6 flex max-w-md gap-2"
                onSubmit={(event) => event.preventDefault()}
              >
                <label htmlFor={emailId} className="sr-only">
                  Work email
                </label>
                <input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-transparent px-4 text-base text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
                <button
                  type="submit"
                  className="min-h-11 rounded-lg bg-white px-5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-black transition-transform active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Join
                </button>
              </form>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-x-8 gap-y-10 @min-[700px]:grid-cols-4 @min-[900px]:col-span-4"
            >
              {FOOTER_LINKS.map((group) => (
                <div key={group.title}>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="font-mono text-xs uppercase tracking-[0.09em] text-zinc-400 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="grid gap-3 border-t border-white/10 py-7 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400 @min-[700px]:grid-cols-3">
            <span>{resolvedCopy}</span>
            <span className="@min-[700px]:text-center">
              <span className="mr-2 text-white">●</span>All systems normal
            </span>
            <span className="@min-[700px]:text-right">Amsterdam · Remote</span>
          </div>
        </DiaFooter>
      ) : null}
    </div>
  );
}

export function DiaFooterPersonalizePanel() {
  const config = usePlaygroundStore((state) => state.diaFooterConfig);
  const updateDiaFooterConfig = usePlaygroundStore(
    (state) => state.updateDiaFooterConfig,
  );
  const resetDiaFooterConfig = usePlaygroundStore(
    (state) => state.resetDiaFooterConfig,
  );

  return (
    <div className="flex flex-col gap-6 px-4 pb-2">
      <SectionTitle>Theme</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {DIA_FOOTER_THEMES.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => updateDiaFooterConfig({ theme })}
            className={cn(
              "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
              config.theme === theme
                ? "border-foreground bg-foreground text-background"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={config.theme === theme}
          >
            {theme.replace("-", " ")}
          </button>
        ))}
      </div>

      <SectionTitle>Copyright text</SectionTitle>
      <input
        type="text"
        value={config.copyrightText}
        onChange={(e) =>
          updateDiaFooterConfig({ copyrightText: e.target.value })
        }
        className="h-10 w-full rounded-md border border-border/70 bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/25"
        aria-label="Copyright text"
      />

      <button
        type="button"
        onClick={resetDiaFooterConfig}
        className="rounded-md border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Reset to defaults
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Scroll the preview panel to reveal the spectrum animation and copyright
        text.
      </p>
    </div>
  );
}
