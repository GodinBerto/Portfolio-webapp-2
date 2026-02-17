"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/themes.context";
import { Moon, Sun } from "lucide-react";

type Props = {
  onClick?: () => void;
};

function SvgSun({ onClick }: Props) {
  return (
    <Sun
      className="cursor-pointer text-yellow-500 hover:text-yellow-600 transition-all duration-300 hover:rotate-90 hover:scale-110"
      onClick={onClick}
    />
  );
}

function SvgMoon({ onClick }: Props) {
  return (
    <Moon
      className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 transition-all duration-300 hover:-rotate-90 hover:scale-110"
      onClick={onClick}
    />
  );
}

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return theme === "dark" ? (
    <SvgSun onClick={() => setTheme("light")} />
  ) : (
    <SvgMoon onClick={() => setTheme("dark")} />
  );
};

export default ThemeToggler;
