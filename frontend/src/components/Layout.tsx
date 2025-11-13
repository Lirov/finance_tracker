import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center px-4">
      <div className="w-full max-w-5xl py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Personal Finance Tracker
          </h1>
          <span className="text-sm text-slate-400">
            Simple · Minimal · Yours
          </span>
        </header>
        {children}
      </div>
    </div>
  );
}
