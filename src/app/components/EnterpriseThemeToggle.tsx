"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function EnterpriseThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="enterprise-toggle-skeleton">
        <div className="h-8 w-14 rounded-full bg-[var(--enterprise-border)] animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="enterprise-theme-toggle group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="enterprise-toggle-track">
        <div className="enterprise-toggle-thumb">
          <div className="enterprise-toggle-icon-container">
            {isDark ? (
              <Moon className="enterprise-toggle-icon" />
            ) : (
              <Sun className="enterprise-toggle-icon" />
            )}
          </div>
        </div>
        <div className="enterprise-toggle-glow" />
      </div>
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}