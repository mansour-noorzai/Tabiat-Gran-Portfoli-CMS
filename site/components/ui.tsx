import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-leaf-600/50 dark:bg-leaf-400/50" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-leaf-700 dark:text-leaf-300">
        {children}
      </span>
    </div>
  );
}

export function Display({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-leaf-950 dark:text-white ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-base dark:text-slate-300 ${className}`}>
      {children}
    </p>
  );
}
