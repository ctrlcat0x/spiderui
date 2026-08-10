"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export interface PromptInputSubmission {
  model: string;
  effort: string;
  attachments: File[];
}

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, details: PromptInputSubmission) => void;
  placeholder?: string;
  models?: string[];
  efforts?: string[];
  defaultModel?: string;
  defaultEffort?: string;
  maxAttachments?: number;
  enableAttachments?: boolean;
  enableVoice?: boolean;
  onVoiceChange?: (recording: boolean) => void;
  className?: string;
}

type Attachment = { file: File; url: string };

const DEFAULT_MODELS = ["GPT 5.5", "Claude Opus", "Gemini Flash"];
const DEFAULT_EFFORTS = ["Low", "Medium", "High"];

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none">
      <path
        d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.5 8.5 0 0 0 12 3.5Zm0 3.2a5.3 5.3 0 1 1-5.3 5.3A5.3 5.3 0 0 1 12 6.7Zm0 2.8a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 12 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EffortIcon({ level }: { level: number }) {
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "w-1 rounded-full bg-current transition-opacity",
            index === 0 ? "h-1.5" : index === 1 ? "h-2.5" : "h-3.5",
            index <= level ? "opacity-100" : "opacity-25",
          )}
        />
      ))}
    </span>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <rect
        x="7"
        y="2.5"
        width="6"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.75 9.5v.75a5.25 5.25 0 0 0 10.5 0V9.5M10 15.5v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path
        d="M10 15V5m0 0L6 9m4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PromptInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  models = DEFAULT_MODELS,
  efforts = DEFAULT_EFFORTS,
  defaultModel,
  defaultEffort,
  maxAttachments = 4,
  enableAttachments = true,
  enableVoice = true,
  onVoiceChange,
  className,
}: PromptInputProps) {
  const reduceMotion = useReducedMotion();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [expanded, setExpanded] = React.useState(Boolean(defaultValue));
  const [recording, setRecording] = React.useState(false);
  const [model, setModel] = React.useState(
    defaultModel ?? models[0] ?? "Model",
  );
  const [effort, setEffort] = React.useState(
    defaultEffort ?? efforts[1] ?? efforts[0] ?? "Medium",
  );
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const attachmentsRef = React.useRef<Attachment[]>([]);
  const value = valueProp ?? internalValue;
  const canSubmit = value.trim().length > 0 || attachments.length > 0;
  const handleChange = onValueChange ?? onChange;

  React.useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  React.useEffect(() => {
    if (!models.includes(model)) setModel(defaultModel ?? models[0] ?? "Model");
  }, [defaultModel, model, models]);

  React.useEffect(() => {
    if (!efforts.includes(effort))
      setEffort(defaultEffort ?? efforts[1] ?? efforts[0] ?? "Medium");
  }, [defaultEffort, effort, efforts]);

  React.useEffect(
    () => () => {
      attachmentsRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
    },
    [],
  );

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !expanded) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 76), 160)}px`;
  }, [expanded, value]);

  const handleValueChange = (nextValue: string) => {
    if (valueProp === undefined) setInternalValue(nextValue);
    handleChange?.(nextValue);
  };

  const handleExpand = () => {
    setExpanded(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.(value, {
      model,
      effort,
      attachments: attachments.map(({ file }) => file),
    });
    if (valueProp === undefined) setInternalValue("");
    handleChange?.("");
    attachments.forEach(({ url }) => URL.revokeObjectURL(url));
    setAttachments([]);
    setRecording(false);
    onVoiceChange?.(false);
    setExpanded(false);
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const available = Math.max(0, maxAttachments - attachments.length);
    const files = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, available);
    event.target.value = "";
    if (!files.length) return;
    setAttachments((current) => [
      ...current,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
    setExpanded(true);
  };

  const handleRemoveAttachment = (url: string) => {
    URL.revokeObjectURL(url);
    setAttachments((current) =>
      current.filter((attachment) => attachment.url !== url),
    );
  };

  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    if (!value.trim() && !attachments.length && !recording) setExpanded(false);
  };

  const actionLabel = canSubmit
    ? "Send prompt"
    : enableVoice
      ? recording
        ? "Stop voice input"
        : "Start voice input"
      : "Enter a prompt to send";

  return (
    <motion.form
      layout
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      onBlur={handleBlur}
      animate={{ maxWidth: expanded ? 640 : 420 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 360, damping: 30, mass: 0.8 }
      }
      className={cn(
        "relative w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#171717] text-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFiles}
      />

      <AnimatePresence initial={false} mode="popLayout">
        {!expanded ? (
          <motion.button
            key="collapsed"
            type="button"
            onClick={handleExpand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            className="flex h-[62px] w-full items-center gap-4 px-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-inset"
          >
            <span className="min-w-0 flex-1 truncate text-base font-semibold text-white/50">
              {placeholder}
            </span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900">
              {enableVoice ? <MicIcon /> : <SparkIcon />}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: "blur(5px)" }
            }
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            className="p-3"
          >
            {attachments.length > 0 && (
              <div className="flex gap-2 overflow-x-auto px-1 pb-2">
                {attachments.map(({ file, url }) => (
                  <div
                    key={url}
                    className="group relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/10"
                  >
                    <img
                      src={url}
                      alt={file.name}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(url)}
                      aria-label={`Remove ${file.name}`}
                      className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => handleValueChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit();
                }
                if (
                  event.key === "Escape" &&
                  !value.trim() &&
                  !attachments.length
                )
                  setExpanded(false);
              }}
              placeholder={placeholder}
              aria-label="Prompt"
              className="block min-h-[76px] max-h-40 w-full resize-none overflow-y-auto bg-transparent px-3 py-2 text-base leading-6 text-white outline-none placeholder:text-white/50"
            />

            <div className="flex items-center gap-1 pt-1 text-white/55">
              <label className="relative flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-white/5 hover:text-white">
                <SparkIcon />
                <span>{model}</span>
                <select
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  aria-label="AI model"
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {models.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="relative flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-white/5 hover:text-white">
                <EffortIcon level={Math.max(0, efforts.indexOf(effort))} />
                <span>{effort}</span>
                <select
                  value={effort}
                  onChange={(event) => setEffort(event.target.value)}
                  aria-label="Reasoning effort"
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {efforts.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <div className="ml-auto flex items-center gap-1">
                {enableAttachments && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={attachments.length >= maxAttachments}
                    aria-label="Attach images"
                    className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                  >
                    <PlusIcon />
                  </button>
                )}
                <button
                  type={canSubmit ? "submit" : "button"}
                  onClick={() => {
                    if (!canSubmit && enableVoice) {
                      setRecording((current) => {
                        onVoiceChange?.(!current);
                        return !current;
                      });
                    }
                  }}
                  disabled={!canSubmit && !enableVoice}
                  aria-label={actionLabel}
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-40",
                    canSubmit
                      ? "bg-white text-zinc-950 hover:bg-white/90"
                      : recording
                        ? "bg-red-500 text-white"
                        : "bg-white text-zinc-950 hover:bg-white/90",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={canSubmit ? "send" : recording ? "stop" : "mic"}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.65, filter: "blur(3px)" }
                      }
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.65, filter: "blur(3px)" }}
                      className="flex items-center justify-center"
                    >
                      {canSubmit ? (
                        <ArrowIcon />
                      ) : recording ? (
                        <span className="size-3 rounded-sm bg-current" />
                      ) : (
                        <MicIcon />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
