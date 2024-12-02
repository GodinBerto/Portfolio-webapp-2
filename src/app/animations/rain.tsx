"use client";

import React, { useEffect, useState } from "react";
import style from "../styles/rain.module.css";

const Rain = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

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
  }, [isLargeScreen]);

  return isLargeScreen ? (
    <div
      className={`${style.rainContainer} relative w-full h-full overflow-hidden z-10`}
    ></div>
  ) : null; // Render nothing if not a large screen
};

export default Rain;
