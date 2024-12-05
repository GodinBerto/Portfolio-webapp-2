"use client";

import React, { useEffect, useState } from "react";
import style from "../styles/rain.module.css";
import { useTheme } from "../themes/themeContext/themeContext";

const Rain = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { theme } = useTheme();

  // Map themes to Tailwind classes
  const themeColors: { [key: string]: { top: string; bottom: string } } = {
    red: { top: "rgba(200, 4, 4, 1)", bottom: "rgba(200, 4, 4, 0)" },
    yellow: { top: "rgba(220, 202, 0, 1)", bottom: "rgba(220, 202, 0, 0)" },
    blue: { top: "rgba(30, 58, 138, 1)", bottom: "rgba(30, 58, 138, 0)" },
    green: { top: "rgba(0, 191, 86, 1)", bottom: "rgba(0, 191, 86, 0)" },
    light: {
      top: "rgba(255, 255, 255, 1)",
      bottom: "rgba(255, 255, 255, 0)",
    },
    dark: { top: "rgba(26, 26, 26, 1)", bottom: "rgba(26, 26, 26, 0)" },
  };

  const currentColors = themeColors[theme] || themeColors["blue"];

  useEffect(() => {
    // Function to check screen size
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1240); // Large screen breakpoint
    };

    // Initial check
    updateScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return; // Do not run animation if not on large screens

    const container = document.querySelector(`.${style.rainContainer}`);
    if (!container) return;

    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.classList.add(style.raindrop); // Use the CSS module class
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${Math.random() * 2 + 1}s`; // Random fall duration
      drop.style.width = `${Math.random() * 1 + 2}px`; // Random width
      drop.style.height = `${Math.random() * 10 + 10}px`; // Random height
      drop.style.background = currentColors.top; // Use the current theme's color for the raindrop

      container.appendChild(drop);

      // Remove drop after animation ends
      setTimeout(() => {
        if (container && container.contains(drop)) {
          container.removeChild(drop);
        }
      }, 3000);
    };

    const interval = setInterval(createRainDrop, 100);

    return () => clearInterval(interval);
  }, [isLargeScreen, currentColors]);

  return isLargeScreen ? (
    <div
      className={`${style.rainContainer} relative w-full h-full overflow-hidden z-10`}
    ></div>
  ) : null; // Render nothing if not a large screen
};

export default Rain;
