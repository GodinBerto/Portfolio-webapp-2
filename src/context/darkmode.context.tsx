"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie } from "cookies-next";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // --- 1. On mount: read cookie or fallback ---
  useEffect(() => {
    const saved = (getCookie("theme") as Theme) || "system";
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  // --- 2. Watch system preference if theme === system ---
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const system = media.matches ? "dark" : "light";
      setResolvedTheme(system);
      applyTheme("system");
    };

    media.addEventListener("change", handleChange);
    handleChange(); // initial check

    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  // --- 3. Apply theme and save to cookie ---
  const applyTheme = (newTheme: Theme) => {
    let effectiveTheme: "light" | "dark";

    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = newTheme;
    }

    setResolvedTheme(effectiveTheme);

    const html = document.documentElement;
    html.classList.toggle("dark", effectiveTheme === "dark");

    setCookie("theme", newTheme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
