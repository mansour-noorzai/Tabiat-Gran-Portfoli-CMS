import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10 xl:px-12 ${className}`}>{children}</div>
  );
}

export function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-px w-8 ${inverse ? "bg-lime-300/70" : "bg-leaf-600/50 dark:bg-leaf-400/50"}`} />
      <span className={`text-[10px] font-extrabold uppercase tracking-[0.22em] ${inverse ? "text-lime-300" : "text-leaf-700 dark:text-leaf-300"}`}>
        {children}
      </span>
    </div>
  );
}

export function Display({
  children,
  className = "",
  as: Tag = "h2",
  inverse = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  inverse?: boolean;
}) {
  return (
    <Tag
      className={`text-[clamp(2rem,4.2vw,3.7rem)] font-medium leading-[1.02] tracking-[-0.045em] ${inverse ? "text-white" : "text-slate-950 dark:text-white"} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-2xl text-base leading-7 text-slate-600 sm:leading-8 dark:text-slate-300 ${className}`}>
      {children}
    </p>
  );
}
