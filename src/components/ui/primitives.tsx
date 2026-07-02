import type { ReactNode } from "react";

export function Badge({
  children,
  color = "#6B7280",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
