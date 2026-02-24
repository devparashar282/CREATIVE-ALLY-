"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeCornerToggle() {
  const { theme, toggleTheme, ready } = useTheme();
  const isLight = ready && theme === "light";
  const nextThemeLabel = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      className={`theme-corner-toggle${isLight ? " is-light" : ""}`}
      onClick={toggleTheme}
      aria-label={ready ? nextThemeLabel : "Switch theme"}
      title={ready ? nextThemeLabel : "Switch theme"}
    >
      <span className="theme-corner-toggle-label theme-corner-toggle-label-dark">Dark</span>
      <span className="theme-corner-toggle-label theme-corner-toggle-label-light">Light</span>
      <span className="theme-corner-toggle-thumb" aria-hidden>
        {isLight ? "L" : "D"}
      </span>
    </button>
  );
}
