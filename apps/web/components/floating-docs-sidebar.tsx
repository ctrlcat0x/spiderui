"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { docsConfig } from "@/config/docs"
import { components, isNewComponent } from "@/registry"
import { useClickSound } from "@/hooks/use-click-sound"
import { playSound } from "@/lib/sound-engine"
import { scroll002Sound } from "@/lib/scroll-002"
import { clickSoftSound } from "@/lib/click-soft"
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade"
import { useDocsSidebar } from "@/components/docs-sidebar-context"

type PreviewSources = {
    mp4: string
    webm: string
}

type NavViewMode = "grouped" | "collection"

const SCROLL_SOUND_MS = 70
const TOGGLE_IN_SIDEBAR_DELAY_MS = 180

let preferredPreviewFormat: "webm" | "mp4" | null = null

function getPreferredPreviewSrc(sources: PreviewSources) {
    if (typeof window === "undefined") return sources.mp4
    if (!preferredPreviewFormat) {
        const probe = document.createElement("video")
        const supportsWebm = Boolean(probe.canPlayType('video/webm; codecs="vp9,opus"'))
        preferredPreviewFormat = supportsWebm ? "webm" : "mp4"
    }
    return preferredPreviewFormat === "webm" ? sources.webm : sources.mp4
}

function getPreviewSources(previewVideo?: string) {
    if (!previewVideo) return null
    const match = previewVideo.match(/^(.*)\.(mov|mp4|webm)(\?.*)?$/i)
    if (!match) return null
    const [, base, , query = ""] = match
    return {
        mp4: `${base}.mp4${query}`,
        webm: `${base}.webm${query}`,
    }
}

const DIAL_ROW_CLASS = "flex h-[7px] items-center pl-0.5"

const microDashClassName =
    "h-px w-2.5 shrink-0 rounded-none bg-[#4b5563] transition-[width,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/nav-item:w-3.5 group-hover/nav-item:bg-[#e8470a]/70 group-[.active]/nav-item:w-3.5 group-[.active]/nav-item:bg-[#e8470a]/70"

const navDashClassName =
    "nav-dash h-px w-6 shrink-0 rounded-none bg-[#4b5563] transition-[width,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-[.active]/nav-item:w-8 group-[.active]/nav-item:bg-[#e8470a] group-hover/nav-item:w-10 group-hover/nav-item:bg-[#e8470a]"

const navTextClassName =
    "nav-text truncate text-[14px] font-medium text-[#9ca3af] transition-colors duration-150 ease-in-out group-[.active]/nav-item:text-[#e8470a] group-hover/nav-item:text-[#e8470a]"

const companionDashClassName =
    "h-px w-4 shrink-0 rounded-none bg-[#4b5563] transition-[width,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/nav-item:w-5 group-hover/nav-item:bg-[#e8470a]/85 group-[.active]/nav-item:w-5 group-[.active]/nav-item:bg-[#e8470a]/85"

function SidebarToggleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M184,40H72A32,32,0,0,0,40,72V184A32,32,0,0,0,72,216H184A32,32,0,0,0,216,184V72A32,32,0,0,0,184,40ZM56,72A16,16,0,0,1,72,56H128V200H72A16,16,0,0,1,56,184Z" />
        </svg>
    )
}

function SidebarToggleButton({
    onClick,
    className,
    isOpen,
}: {
    onClick: () => void
    className?: string
    isOpen: boolean
}) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={onClick}
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                isOpen && "text-zinc-900 dark:text-zinc-100",
                className
            )}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
        >
            <SidebarToggleIcon />
        </motion.button>
    )
}

function GroupSeparator({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 py-1.5 mt-3 mb-0.5">
            <div className="flex w-7 shrink-0 items-center pl-0.5" aria-hidden>
                <span className="h-px w-4 shrink-0 bg-foreground/50" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/60 whitespace-nowrap">
                {title}
            </span>
        </div>
    )
}

function DialLine({
    variant,
    highlighted,
}: {
    variant: "micro" | "companion" | "main"
    highlighted: boolean
}) {
    const className =
        variant === "main"
            ? cn(navDashClassName, highlighted && "!w-10 !bg-[#e8470a]")
            : variant === "companion"
              ? cn(companionDashClassName, highlighted && "!w-5 !bg-[#e8470a]/85")
              : cn(microDashClassName, highlighted && "!w-3.5 !bg-[#e8470a]/70")

    return (
        <div className={DIAL_ROW_CLASS}>
            <span className={className} />
        </div>
    )
}

function NavItemLink({
    item,
    isActive,
    isHighlighted,
    textTop,
    onNavigate,
    onHoverEnter,
    onHoverMove,
}: {
    item: { title: string; href: string }
    isActive: boolean
    isHighlighted: boolean
    textTop: number
    onNavigate: () => void
    onHoverEnter: (event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverMove: (event: React.MouseEvent<HTMLAnchorElement>) => void
}) {
    const slug = item.href.split("/").pop()
    const comp = slug ? components[slug] : undefined
    const isNew = comp ? isNewComponent(comp) : false

    return (
        <>
            <div
                className="absolute left-7 right-0 flex min-w-0 items-center gap-2 pr-1"
                style={{ top: textTop, height: 7 }}
            >
                <span className={cn(navTextClassName, (isActive || isHighlighted) && "text-[#e8470a]")}>{item.title}</span>
                {isNew && (
                    <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                        NEW
                    </span>
                )}
            </div>
            <Link
                href={item.href}
                onMouseEnter={onHoverEnter}
                onMouseMove={onHoverMove}
                onClick={onNavigate}
                className="nav-item absolute inset-x-0 z-10"
                style={{ top: Math.max(0, textTop - 14), height: 35 }}
                aria-current={isActive ? "page" : undefined}
            />
        </>
    )
}

function NavItemList({
    items,
    pathname,
    onNavigate,
    onHoverEnter,
    onHoverMove,
    onHoverLeave,
}: {
    items: { title: string; href: string }[]
    pathname: string
    onNavigate: () => void
    onHoverEnter: (item: { title: string; href: string }, event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverMove: (event: React.MouseEvent<HTMLAnchorElement>) => void
    onHoverLeave: () => void
}) {
    const [hoveredHref, setHoveredHref] = React.useState<string | null>(null)

    const itemLayouts = React.useMemo(() => {
        let rowOffset = 0
        return items.map((item, index) => {
            const rowsBeforeMain = index === 0 ? 2 : 0
            const textTop = rowOffset + rowsBeforeMain * 7
            const rowCount = index === 0 ? 5 : 3
            rowOffset += rowCount * 7
            return { item, textTop }
        })
    }, [items])

    const totalHeight = items.length === 0 ? 0 : 35 + (items.length - 1) * 21

    const isItemHighlighted = (href: string) => pathname === href || hoveredHref === href

    return (
        <div
            className="relative flex"
            onMouseLeave={() => {
                setHoveredHref(null)
                onHoverLeave()
            }}
        >
            <div className="pointer-events-none flex w-7 shrink-0 flex-col" aria-hidden>
                {items.map((item, index) => {
                    const highlighted = isItemHighlighted(item.href)
                    const prevHighlighted =
                        index > 0 ? isItemHighlighted(items[index - 1]!.href) : false
                    const nextHighlighted =
                        index < items.length - 1 ? isItemHighlighted(items[index + 1]!.href) : false
                    const boundaryHighlighted = highlighted || nextHighlighted
                    const leadingBoundaryHighlighted = highlighted || prevHighlighted

                    return (
                        <React.Fragment key={`dial-${item.href}`}>
                            {index === 0 && (
                                <>
                                    <DialLine variant="micro" highlighted={leadingBoundaryHighlighted} />
                                    <DialLine variant="companion" highlighted={leadingBoundaryHighlighted} />
                                </>
                            )}
                            <DialLine variant="main" highlighted={highlighted} />
                            <DialLine variant="companion" highlighted={boundaryHighlighted} />
                            <DialLine variant="micro" highlighted={boundaryHighlighted} />
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="relative min-w-0 flex-1" style={{ minHeight: totalHeight }}>
                {itemLayouts.map(({ item, textTop }) => (
                    <NavItemLink
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        isHighlighted={isItemHighlighted(item.href)}
                        textTop={textTop}
                        onNavigate={onNavigate}
                        onHoverEnter={(e) => {
                            setHoveredHref(item.href)
                            onHoverEnter(item, e)
                        }}
                        onHoverMove={onHoverMove}
                    />
                ))}
            </div>
        </div>
    )
}

export function FloatingDocsSidebar() {
    const pathname = usePathname()
    const playClick = useClickSound()
    const { isOpen, setIsOpen } = useDocsSidebar()
    const [toggleInSidebar, setToggleInSidebar] = React.useState(false)
    const [viewMode, setViewMode] = React.useState<NavViewMode>("grouped")
    const [isHoverVideoReady, setIsHoverVideoReady] = React.useState(false)
    const [hoverPreview, setHoverPreview] = React.useState<{
        title: string
        videoSrc: string
        mp4: string
        webm: string
    } | null>(null)
    const [hoverPosition, setHoverPosition] = React.useState<{ x: number; y: number } | null>(null)
    const warmedPreviewKeys = React.useRef(new Set<string>())
    const warmingVideos = React.useRef(new Map<string, HTMLVideoElement>())
    const scrollPlaybackRef = React.useRef<{ stop: () => void } | null>(null)
    const scrollSoundTimerRef = React.useRef<number | null>(null)
    const toggleMorphTimerRef = React.useRef<number | null>(null)
    const sidebarPanelRef = React.useRef<HTMLDivElement>(null)
    const navScrollContainerRef = React.useRef<HTMLDivElement>(null)
    const navScrollStepRef = React.useRef<number>(0)

    const playDialTick = React.useCallback(() => {
        void playSound(clickSoftSound.dataUri, { volume: 0.1, playbackRate: 2.0 })
    }, [])

    const handleNavScroll = React.useCallback(() => {
        const container = navScrollContainerRef.current
        if (!container) return
        const stepSizePx = 7
        const nextStep = Math.floor(container.scrollTop / stepSizePx)
        if (nextStep !== navScrollStepRef.current) {
            navScrollStepRef.current = nextStep
            if (nextStep % 3 === 0) {
                playDialTick()
            }
        }
    }, [playDialTick])

    const gettingStartedGroup = docsConfig.nav[0]
    const componentGroups = docsConfig.nav.slice(1)
    const collectionItems = docsConfig.flatComponentNav

    const warmPreviewAssets = React.useCallback((sources: PreviewSources) => {
        if (typeof window === "undefined") return
        const selectedSrc = getPreferredPreviewSrc(sources)
        if (warmedPreviewKeys.current.has(selectedSrc)) return

        warmedPreviewKeys.current.add(selectedSrc)

        const video = document.createElement("video")
        video.preload = "auto"
        video.muted = true
        video.playsInline = true
        video.src = selectedSrc
        video.load()
        warmingVideos.current.set(selectedSrc, video)
    }, [])

    const getPreviewPosition = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const cardWidth = 224
            const cardHeight = 170
            const offset = 18
            const maxX = Math.max(16, window.innerWidth - cardWidth - 16)
            const maxY = Math.max(16, window.innerHeight - cardHeight - 16)
            const x = Math.max(16, Math.min(event.clientX + offset, maxX))
            const y = Math.max(16, Math.min(event.clientY + offset, maxY))
            return { x, y }
        },
        []
    )

    const stopScrollSound = React.useCallback(() => {
        if (scrollSoundTimerRef.current !== null) {
            window.clearTimeout(scrollSoundTimerRef.current)
            scrollSoundTimerRef.current = null
        }
        scrollPlaybackRef.current?.stop()
        scrollPlaybackRef.current = null
    }, [])

    const startScrollSound = React.useCallback(() => {
        stopScrollSound()
        void playSound(scroll002Sound.dataUri, { volume: 0.07, playbackRate: 2.2 }).then((playback) => {
            scrollPlaybackRef.current = playback
            scrollSoundTimerRef.current = window.setTimeout(() => {
                playback.stop()
                if (scrollPlaybackRef.current === playback) {
                    scrollPlaybackRef.current = null
                }
                scrollSoundTimerRef.current = null
            }, SCROLL_SOUND_MS)
        })
    }, [stopScrollSound])

    const updateHoverPreview = React.useCallback(
        (
            item: { title: string; href: string },
            event: React.MouseEvent<HTMLAnchorElement>
        ) => {
            const slug = item.href.split("/").pop()
            if (!slug) {
                setHoverPreview(null)
                return
            }

            const previewVideo = components[slug]?.previewVideo
            const sources = getPreviewSources(previewVideo)
            if (!sources) {
                setHoverPreview(null)
                setHoverPosition(null)
                return
            }
            warmPreviewAssets(sources)
            setHoverPosition(getPreviewPosition(event))

            setHoverPreview({
                title: item.title,
                videoSrc: getPreferredPreviewSrc(sources),
                mp4: sources.mp4,
                webm: sources.webm,
            })
        },
        [getPreviewPosition, warmPreviewAssets]
    )

    const updateHoverPosition = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            setHoverPosition(getPreviewPosition(event))
        },
        [getPreviewPosition]
    )

    const handleNavHoverEnter = React.useCallback(
        (item: { title: string; href: string }, event: React.MouseEvent<HTMLAnchorElement>) => {
            startScrollSound()
            updateHoverPreview(item, event)
        },
        [startScrollSound, updateHoverPreview]
    )

    const handleNavHoverLeave = React.useCallback(() => {
        stopScrollSound()
        setHoverPreview(null)
        setHoverPosition(null)
    }, [stopScrollSound])

    const clearToggleMorphTimer = React.useCallback(() => {
        if (toggleMorphTimerRef.current !== null) {
            window.clearTimeout(toggleMorphTimerRef.current)
            toggleMorphTimerRef.current = null
        }
    }, [])

    const handleToggleOpen = () => {
        playClick()
        if (isOpen) {
            clearToggleMorphTimer()
            setToggleInSidebar(false)
            setIsOpen(false)
            return
        }

        setIsOpen(true)
        clearToggleMorphTimer()
        toggleMorphTimerRef.current = window.setTimeout(() => {
            setToggleInSidebar(true)
            toggleMorphTimerRef.current = null
        }, TOGGLE_IN_SIDEBAR_DELAY_MS)
    }

    const handleClose = React.useCallback(() => {
        playClick()
        setToggleInSidebar(false)
        setIsOpen(false)
    }, [playClick, setIsOpen])

    const handleViewModeToggle = () => {
        playClick()
        setViewMode((prev) => (prev === "grouped" ? "collection" : "grouped"))
    }

    const handleNavigate = () => {
        playClick()
        stopScrollSound()
        setHoverPreview(null)
        setHoverPosition(null)
        setToggleInSidebar(false)
        setIsOpen(false)
    }

    React.useEffect(() => {
        setToggleInSidebar(false)
        setIsOpen(false)
    }, [pathname, setIsOpen])

    React.useEffect(() => {
        if (!isOpen) {
            setToggleInSidebar(false)
            stopScrollSound()
            setHoverPreview(null)
            setHoverPosition(null)
            setIsHoverVideoReady(false)
        }
    }, [isOpen, stopScrollSound])

    React.useEffect(() => {
        if (!hoverPreview) {
            setIsHoverVideoReady(false)
            return
        }
        setIsHoverVideoReady(false)
    }, [hoverPreview?.videoSrc])

    React.useEffect(() => {
        if (!isOpen) return

        const initialSources: PreviewSources[] = []
        for (const group of docsConfig.nav) {
            for (const item of group.items) {
                const slug = item.href.split("/").pop()
                if (!slug) continue
                const previewVideo = components[slug]?.previewVideo
                const sources = getPreviewSources(previewVideo)
                if (!sources) continue
                initialSources.push(sources)
                if (initialSources.length >= 5) break
            }
            if (initialSources.length >= 5) break
        }

        initialSources.forEach((sources) => warmPreviewAssets(sources))
    }, [isOpen, warmPreviewAssets])

    React.useEffect(() => () => {
        stopScrollSound()
        clearToggleMorphTimer()
    }, [stopScrollSound, clearToggleMorphTimer])

    React.useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            const panel = sidebarPanelRef.current
            if (!panel) return
            if (panel.contains(event.target as Node)) return
            handleClose()
        }

        document.addEventListener("pointerdown", handlePointerDown)
        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [isOpen, handleClose])

    const showHeaderToggle = !isOpen || !toggleInSidebar
    const showSidebarToggle = isOpen && toggleInSidebar

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                {showHeaderToggle && (
                    <SidebarToggleButton key="header-toggle" onClick={handleToggleOpen} isOpen={false} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="sidebar-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"
                            aria-hidden
                        />

                        <motion.div
                            initial={{ x: -320, opacity: 0, filter: "blur(10px)" }}
                            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ x: -60, opacity: 0, filter: "blur(5px)" }}
                            transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.8 }}
                            className="fixed top-4 bottom-4 left-6 z-50 w-72 flex flex-col"
                        >
                            <div
                                ref={sidebarPanelRef}
                                className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200/60 bg-white p-2 shadow-2xl shadow-black/40 dark:border-zinc-800/60 dark:bg-[#121212]"
                            >
                                <div className="flex items-center px-1.5 pt-4 pb-3">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {showSidebarToggle ? (
                                            <SidebarToggleButton key="sidebar-toggle" onClick={handleToggleOpen} isOpen />
                                        ) : (
                                            <motion.div
                                                key="sidebar-toggle-spacer"
                                                initial={false}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="h-8 w-8 shrink-0"
                                                aria-hidden
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative min-h-0 flex-1">
                                    <ScrollEdgeFade position="top" variant="sidebar" />
                                    <ScrollEdgeFade position="bottom" variant="sidebar" />

                                    <div ref={navScrollContainerRef} onScroll={handleNavScroll} className="h-full overflow-y-auto px-1.5 pt-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        <button
                                            type="button"
                                            onClick={handleViewModeToggle}
                                            className="mb-4 mt-2 flex w-full items-center gap-2 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            aria-label={`Switch to ${viewMode === "grouped" ? "collection" : "grouped"} view`}
                                        >
                                            <span className="w-7 shrink-0" aria-hidden />
                                            <span className="inline-flex items-center gap-1.5">
                                                <span>{viewMode === "grouped" ? "Grouped" : "Collection"}</span>
                                                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                            </span>
                                        </button>

                                        {gettingStartedGroup && (
                                            <div className="mb-4">
                                                <GroupSeparator title={gettingStartedGroup.title} />
                                                <NavItemList
                                                    items={gettingStartedGroup.items}
                                                    pathname={pathname}
                                                    onNavigate={handleNavigate}
                                                    onHoverEnter={handleNavHoverEnter}
                                                    onHoverMove={updateHoverPosition}
                                                    onHoverLeave={handleNavHoverLeave}
                                                />
                                            </div>
                                        )}

                                        {viewMode === "grouped" ? (
                                            componentGroups.map((group, index) => (
                                                <div key={index} className="mb-3 last:mb-0">
                                                    <GroupSeparator title={group.title} />
                                                    <NavItemList
                                                        items={group.items}
                                                        pathname={pathname}
                                                        onNavigate={handleNavigate}
                                                        onHoverEnter={handleNavHoverEnter}
                                                        onHoverMove={updateHoverPosition}
                                                        onHoverLeave={handleNavHoverLeave}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="mb-3 last:mb-0">
                                                <GroupSeparator title="Collection" />
                                                <NavItemList
                                                    items={collectionItems}
                                                    pathname={pathname}
                                                    onNavigate={handleNavigate}
                                                    onHoverEnter={handleNavHoverEnter}
                                                    onHoverMove={updateHoverPosition}
                                                    onHoverLeave={handleNavHoverLeave}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {hoverPreview && hoverPosition && (
                                    <motion.div
                                        key={hoverPreview.videoSrc}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.08, ease: "easeOut" }}
                                        className="fixed z-[70] w-56 pointer-events-none"
                                        style={{
                                            left: hoverPosition.x,
                                            top: hoverPosition.y,
                                        }}
                                    >
                                        <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl">
                                            <div className="relative h-32 w-full bg-zinc-100 dark:bg-zinc-800/60">
                                                <video
                                                    key={hoverPreview.videoSrc}
                                                    src={hoverPreview.videoSrc}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    preload="auto"
                                                    onLoadedData={() => setIsHoverVideoReady(true)}
                                                    className={cn(
                                                        "relative h-full w-full object-cover transition-opacity duration-150",
                                                        isHoverVideoReady ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
