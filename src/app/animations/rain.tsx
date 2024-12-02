"use client";

import React, { useEffect } from "react";

const Rain = () => {
  useEffect(() => {
    const container = document.querySelector(".rain-container");

    if (!container) return;

    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.classList.add("raindrop");
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${Math.random() * 2 + 1}s`; // Random fall duration
      drop.style.width = `${Math.random() * 1 + 2}px`; // Random width
      drop.style.height = `${Math.random() * 10 + 10}px`; // Random height
      container.appendChild(drop);

      // Remove drop after animation ends
      setTimeout(() => {
        container.removeChild(drop);
      }, 3000);
    };

    const interval = setInterval(createRainDrop, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rain-container relative w-full h-full overflow-hidden z-10"></div>
  );
};

export default Rain;
