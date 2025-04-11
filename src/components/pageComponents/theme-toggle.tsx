"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/themes.context";
import { Moon, Sun } from "lucide-react";

const themeClass = ``;

function SvgSun() {
  return (
    <Sun className="cursor-pointer text-yellow-500 hover:text-yellow-600 transition-all duration-300 hover:rotate-90 hover:scale-110" />
  );
}

function SvgMoon() {
  return (
    <Moon className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 transition-all duration-300 hover:-rotate-90 hover:scale-110" />
  );
}

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent mismatches by rendering nothing on server

  return (
    <div
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={themeClass}
    >
      {theme === "dark" ? <SvgSun /> : <SvgMoon />}
    </div>
  );
};

export default ThemeToggler;
