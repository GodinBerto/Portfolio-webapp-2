"use client";
import { useTheme } from "@/context/themeContext";
import React, { ReactNode } from "react";

interface Types {
  children: string;
  className?: string;
  onClick?: () => void;
}

export default function Button1({ children, className, onClick }: Types) {
  const { theme } = useTheme();

  // Map themes to Tailwind classes
  const themeClasses: { [key: string]: string } = {
    red: "bg-red-600 border-red-600",
    yellow: "bg-yellow-500 border-yellow-500",
    blue: "bg-blue-500 border-blue-500",
    green: "bg-green-600 border-green-600",
  };

  // Determine the current class string
  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]"; // Default to blue if theme not found

  return (
    <button
      className={`py-2 px-6 text-white rounded-md border-2 h-10 flex items-center justify-center ${currentThemeClass} transition-transform transform hover:scale-110 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
