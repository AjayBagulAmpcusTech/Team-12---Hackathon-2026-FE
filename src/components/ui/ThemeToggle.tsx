"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("incident-copilot-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle magnetic"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      data-state={theme}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__halo" />
        <span className="theme-toggle__knob">
          <span className="theme-toggle__sun" />
          <span className="theme-toggle__moon" />
        </span>
      </span>
      <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
