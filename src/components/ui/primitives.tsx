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
      className={
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.18)] " +
        className
      }
      style={{
        backgroundColor: color + "E6",
        borderColor: color + "70",
        boxShadow: "0 12px 32px " + color + "25",
      }}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"premium-card rounded-[1.55rem] p-5 " + className}>{children}</div>;
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
    primary: "btn-premium",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "magnetic rounded-xl px-4 py-2.5 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 " +
        variants[variant] +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}
