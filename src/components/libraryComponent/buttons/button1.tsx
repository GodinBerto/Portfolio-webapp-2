"use client";
import { useTheme } from "@/app/themes/themeContext/themeContext";
import React, { ReactNode } from "react";

export default function Button1({ children }: { children: string }) {
  const { theme } = useTheme();

  // Map themes to Tailwind classes
  const themeClasses: { [key: string]: string } = {
    red: "bg-[#C80404] border-[#C80404]",
    yellow: "bg-[#DCCA00] border-[#DCCA00]",
    blue: "bg-[#1e3a8a] border-[#1e3a8a]",
    green: "bg-[#00BF56] border-[#00BF56]",
    light: "bg-[#ffffff] border-[#ffffff] text-black",
    dark: "bg-[#1a1a1a] border-[#1a1a1a]",
  };

  // Determine the current class string
  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]"; // Default to blue if theme not found

  return (
    <button
      className={`py-2 px-6 text-white rounded-md border-2 h-10 flex items-center ${currentThemeClass} transition-transform transform hover:scale-110`}
    >
      {children}
    </button>
  );
}
