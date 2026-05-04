import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Info,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function StoryButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  ariaLabel
}) {
  const variantClass =
    variant === "secondary"
      ? "border border-ink/15 bg-white text-ink hover:border-ink/35"
      : variant === "ghost"
        ? "bg-transparent text-ink hover:bg-ink/5"
        : "bg-ink text-white hover:bg-ink/90";

  return (
    <button
      aria-label={ariaLabel}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-ink/30 disabled:cursor-not-allowed disabled:opacity-40 ${variantClass} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({ label, onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-ink/15 bg-white text-ink transition hover:border-ink/35 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-ink/30 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function ProgressNav({
  current,
  total,
  slides,
  onJump,
  onNext,
  onPrev
}) {
  const [open, setOpen] = useState(false);
  const progress = ((current + 1) / total) * 100;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-ink/15 bg-white px-3 text-sm font-semibold text-ink hover:border-ink/35"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          Story Map
          <ChevronDown
            size={16}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div className="order-3 min-w-0 flex-1 basis-full sm:order-none sm:basis-auto">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            <span>
              Page {current + 1} of {total}
            </span>
            <span className="hidden truncate sm:block">
              {slides[current].section}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-ink transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <IconButton label="Previous page" onClick={onPrev} disabled={current === 0}>
            <ArrowLeft size={18} />
          </IconButton>
          <IconButton
            label="Next page"
            onClick={onNext}
            disabled={current === total - 1}
          >
            <ArrowRight size={18} />
          </IconButton>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-ink/10 bg-white"
          >
            <nav className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => {
                    onJump(index);
                    setOpen(false);
                  }}
                  className={`rounded-md border p-3 text-left transition ${
                    index === current
                      ? "border-ink bg-ink text-white"
                      : "border-ink/10 bg-white text-ink hover:border-ink/35 hover:bg-paper"
                  }`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
                    {index + 1}. {slide.section}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">{slide.title}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SlideContainer({
  title,
  question,
  insight,
  children,
  note,
  actions,
  eyebrow
}) {
  return (
    <motion.section
      key={title}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:py-10"
    >
      <div className="mb-5 max-w-4xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
        )}
        <p className="text-base font-semibold text-muted">{question}</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
      </div>

      <div className="flex flex-1 items-stretch">{children}</div>

      <div className="mt-5 grid gap-3 border-t border-ink/10 pt-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="text-lg font-semibold leading-snug text-ink sm:text-xl">
          {insight}
        </p>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {note && <div className="mt-3">{note}</div>}
    </motion.section>
  );
}

export function CaveatBox({ children, tone = "amber" }) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : tone === "green"
        ? "border-green-200 bg-green-50 text-green-900"
        : "border-amber-200 bg-amber-50 text-amber-950";

  return (
    <div className={`flex gap-3 rounded-md border p-3 text-sm ${toneClass}`}>
      <Info size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function MethodNote({ children }) {
  return (
    <details className="rounded-md border border-ink/10 bg-white p-3 text-sm text-muted">
      <summary className="cursor-pointer font-semibold text-ink">Method note</summary>
      <div className="mt-2 leading-relaxed">{children}</div>
    </details>
  );
}

export function DetailsBlock({ title, children }) {
  return (
    <details className="rounded-md border border-ink/10 bg-white p-4 text-sm">
      <summary className="cursor-pointer font-bold text-ink">{title}</summary>
      <div className="mt-3 text-muted">{children}</div>
    </details>
  );
}

export function BottomNav({ current, total, onNext, onPrev }) {
  return (
    <div className="hidden">
      <IconButton label="Previous page" onClick={onPrev} disabled={current === 0}>
        <ArrowLeft size={18} />
      </IconButton>
      <IconButton label="Next page" onClick={onNext} disabled={current === total - 1}>
        <ArrowRight size={18} />
      </IconButton>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-6">
      <div className="max-w-md rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <BookOpen className="mb-4 text-ink" />
        <h1 className="text-2xl font-black text-ink">Loading the policy story</h1>
        <p className="mt-2 text-muted">
          Preparing the verified project data and interactive visuals.
        </p>
      </div>
    </main>
  );
}

export function Checklist({ items }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-ink">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800">
            <Check size={14} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
