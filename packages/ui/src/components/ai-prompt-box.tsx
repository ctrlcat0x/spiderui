"use client";

import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

export type AIPromptMode = "search" | "think" | "canvas";

export interface AIPromptBoxProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (message: string, files?: File[]) => void;
  onStop?: () => void;
  onRecordingChange?: (recording: boolean) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxHeight?: number;
  maxFileSize?: number;
  maxFiles?: number;
  accept?: string;
  modes?: AIPromptMode[];
  className?: string;
}

type Attachment = { file: File; url: string };

function acceptsFile(file: File, accept: string) {
  if (!accept.trim()) return true;
  return accept.split(",").some((rule) => {
    const value = rule.trim().toLowerCase();
    if (value.startsWith(".")) return file.name.toLowerCase().endsWith(value);
    if (value.endsWith("/*")) return file.type.startsWith(value.slice(0, -1));
    return file.type.toLowerCase() === value;
  });
}

function Icon({
  name,
}: {
  name:
    | "arrow"
    | "attach"
    | "canvas"
    | "close"
    | "globe"
    | "mic"
    | "stop"
    | "think";
}) {
  const paths = {
    arrow: <path d="M10 15V5m0 0L6 9m4-4 4 4" />,
    attach: (
      <path d="m7.5 10.5 4.9-4.9a3 3 0 0 1 4.2 4.2l-6.3 6.3a5 5 0 0 1-7.1-7.1l6.1-6.1a3 3 0 0 1 4.2 4.2l-6 6a1 1 0 0 1-1.4-1.4L11 6.8" />
    ),
    canvas: (
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h4l1.5 2h5.5A1.5 1.5 0 0 1 17 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5v-9ZM8 9l-2 2 2 2m4-4 2 2-2 2" />
    ),
    close: <path d="m6 6 8 8m0-8-8 8" />,
    globe: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="M3 10h14M10 3a11 11 0 0 1 0 14M10 3a11 11 0 0 0 0 14" />
      </>
    ),
    mic: (
      <>
        <rect x="7" y="2.5" width="6" height="10" rx="3" />
        <path d="M4.75 9.5v.75a5.25 5.25 0 0 0 10.5 0V9.5M10 15.5v2" />
      </>
    ),
    stop: <rect x="6" y="6" width="8" height="8" rx="1.5" />,
    think: (
      <>
        <path d="M7 15h6m-5 2h4M6.5 12.5A6 6 0 1 1 13.7 13c-.7.5-1 1-1.1 1.5H7.5c-.1-.7-.4-1.3-1-2Z" />
        <path d="M10 6v4m-2-2h4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const MODE_LABELS: Record<AIPromptMode, string> = {
  search: "Search",
  think: "Think",
  canvas: "Canvas",
};

const MODE_ICONS: Record<AIPromptMode, "canvas" | "globe" | "think"> = {
  search: "globe",
  think: "think",
  canvas: "canvas",
};

export const PromptInputBox = React.forwardRef<
  HTMLFormElement,
  AIPromptBoxProps
>(
  (
    {
      onSend,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onStop,
      onRecordingChange,
      isLoading = false,
      placeholder = "Type your message here...",
      maxHeight = 180,
      maxFileSize = 10 * 1024 * 1024,
      maxFiles = 3,
      accept = "image/*",
      modes = ["search", "think", "canvas"],
      className,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);
    const [activeMode, setActiveMode] = React.useState<AIPromptMode | null>(
      null,
    );
    const [recording, setRecording] = React.useState(false);
    const [seconds, setSeconds] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const attachmentsRef = React.useRef<Attachment[]>([]);
    const value = valueProp ?? internalValue;
    const hasContent = value.trim().length > 0 || attachments.length > 0;

    const handleValueChange = React.useCallback(
      (nextValue: string) => {
        if (valueProp === undefined) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      [onValueChange, valueProp],
    );

    React.useEffect(() => {
      attachmentsRef.current = attachments;
    }, [attachments]);

    React.useEffect(
      () => () =>
        attachmentsRef.current.forEach(({ url }) => URL.revokeObjectURL(url)),
      [],
    );

    React.useEffect(() => {
      if (!recording) {
        setSeconds(0);
        return;
      }
      const timer = window.setInterval(
        () => setSeconds((current) => current + 1),
        1000,
      );
      return () => window.clearInterval(timer);
    }, [recording]);

    React.useEffect(() => {
      if (!isLoading) return;
      setRecording(false);
      onRecordingChange?.(false);
    }, [isLoading, onRecordingChange]);

    React.useLayoutEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "0px";
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 64), maxHeight)}px`;
    }, [maxHeight, value]);

    const handleFiles = React.useCallback(
      (incoming: File[]) => {
        const room = Math.max(0, maxFiles - attachments.length);
        const accepted = incoming
          .filter(
            (file) => acceptsFile(file, accept) && file.size <= maxFileSize,
          )
          .slice(0, room)
          .map((file) => ({ file, url: URL.createObjectURL(file) }));
        if (accepted.length)
          setAttachments((current) => [...current, ...accepted]);
      },
      [accept, attachments.length, maxFileSize, maxFiles],
    );

    const handleRemove = (url: string) => {
      URL.revokeObjectURL(url);
      setAttachments((current) => current.filter((item) => item.url !== url));
    };

    const handleSubmit = () => {
      if (!hasContent || isLoading) return;
      onSend?.(
        value.trim(),
        attachments.map(({ file }) => file),
      );
      attachments.forEach(({ url }) => URL.revokeObjectURL(url));
      setAttachments([]);
      handleValueChange("");
    };

    const handleRecording = () => {
      const next = !recording;
      setRecording(next);
      onRecordingChange?.(next);
    };

    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

    return (
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (
            !(nextTarget instanceof Node) ||
            !event.currentTarget.contains(nextTarget)
          ) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "relative w-full rounded-[28px] border border-white/15 bg-[#202023] p-3 text-white shadow-[0_20px_55px_-30px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow] duration-150",
          dragging &&
            "border-violet-400 shadow-[0_20px_60px_-28px_rgba(167,139,250,0.65)]",
          className,
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(event) => {
            handleFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />

        {attachments.length > 0 && !recording && (
          <div className="flex gap-2 overflow-x-auto px-1 pb-2">
            {attachments.map(({ file, url }) => (
              <div
                key={url}
                className="group relative size-14 shrink-0 overflow-hidden rounded-xl outline outline-1 -outline-offset-1 outline-white/10"
              >
                <img
                  src={url}
                  alt={file.name}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  aria-label={`Remove ${file.name}`}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-150 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}
          </div>
        )}

        {recording ? (
          <div
            className="flex min-h-20 items-center gap-4 px-3"
            role="status"
            aria-live="polite"
          >
            <span className="size-2.5 animate-pulse rounded-full bg-red-500" />
            <span className="font-mono text-sm tabular-nums text-white/75">
              {minutes}:{remainingSeconds}
            </span>
            <div
              aria-hidden="true"
              className="flex h-8 flex-1 items-center justify-center gap-1 overflow-hidden"
            >
              {Array.from({ length: 24 }, (_, index) => (
                <span
                  key={index}
                  className="h-3 w-0.5 animate-pulse rounded-full bg-white/45 odd:h-6"
                  style={{ animationDelay: `${index * 45}ms` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="sr-only">Message</span>
            <textarea
              ref={textareaRef}
              value={value}
              disabled={isLoading}
              placeholder={
                activeMode
                  ? `${MODE_LABELS[activeMode]} with AI...`
                  : placeholder
              }
              onChange={(event) => handleValueChange(event.target.value)}
              onPaste={(event) => {
                const files = Array.from(event.clipboardData.files);
                if (files.length) {
                  event.preventDefault();
                  handleFiles(files);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              style={{ maxHeight }}
              className="block min-h-16 w-full resize-none overflow-y-auto bg-transparent px-3 py-2 text-base leading-6 text-white outline-none placeholder:text-white/48 disabled:opacity-50"
            />
          </label>
        )}

        <div className="flex items-end justify-between gap-3 pt-1">
          <div
            className={cn(
              "flex min-w-0 items-center gap-0.5",
              recording && "pointer-events-none invisible",
            )}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || attachments.length >= maxFiles}
              aria-label="Attach images"
              title="Attach images"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/55 transition-[background-color,color,scale] duration-150 hover:bg-white/7 hover:text-white active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-30"
            >
              <Icon name="attach" />
            </button>

            {modes.map((mode, index) => {
              const active = activeMode === mode;
              return (
                <React.Fragment key={mode}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-1 h-7 w-px bg-gradient-to-b from-transparent via-violet-400/55 to-transparent"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveMode(active ? null : mode)}
                    aria-pressed={active}
                    aria-label={`${MODE_LABELS[mode]} mode`}
                    title={`${MODE_LABELS[mode]} mode`}
                    className={cn(
                      "flex h-10 items-center gap-1.5 overflow-hidden rounded-full px-2.5 text-sm font-medium transition-[background-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/7 hover:text-white",
                    )}
                  >
                    <Icon name={MODE_ICONS[mode]} />
                    <span
                      className={cn(
                        "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-150",
                        active && "max-w-20 opacity-100",
                      )}
                    >
                      {MODE_LABELS[mode]}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (isLoading) onStop?.();
              else if (recording) handleRecording();
              else if (hasContent) handleSubmit();
              else handleRecording();
            }}
            aria-label={
              isLoading
                ? "Stop generation"
                : recording
                  ? "Stop recording"
                  : hasContent
                    ? "Send message"
                    : "Start voice message"
            }
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              recording
                ? "bg-red-500 text-white"
                : "bg-white text-zinc-900 hover:bg-white/90",
            )}
          >
            <Icon
              name={
                isLoading || recording ? "stop" : hasContent ? "arrow" : "mic"
              }
            />
          </button>
        </div>
      </form>
    );
  },
);

PromptInputBox.displayName = "PromptInputBox";
