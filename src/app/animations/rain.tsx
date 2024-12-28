"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../themes/themeContext/themeContext";

const Rain = () => {
  const { theme } = useTheme();
  const [drops, setDrops] = useState<Array<{ id: number; delay: number; x: number; opacity: number }>>([]);

  // Theme colors mapping
  const themeColors: { [key: string]: string } = {
    red: "#dc2626",
    yellow: "#eab308",
    blue: "#3b82f6",
    green: "#16a34a",
  };

  const currentColor = themeColors[theme] || themeColors.blue;

  useEffect(() => {
    // Create initial raindrops
    const initialDrops = Array.from({ length: 50 }, (_, index) => ({
      id: index,
      delay: Math.random() * -20,
      x: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.5,
    }));
    setDrops(initialDrops);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentColor}44 0%, transparent 70%)`
        }}
      />

      {/* Rain container */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {drops.map((drop) => (
          <g key={drop.id}>
            {/* Raindrop */}
            <path
              d={`M ${drop.x} -2 L ${drop.x} 0`}
              stroke={currentColor}
              strokeWidth="0.1"
              strokeLinecap="round"
              style={{
                opacity: drop.opacity,
                animation: `rainFall 2s linear ${drop.delay}s infinite`,
              }}
            />
            {/* Ripple effect */}
            <circle
              cx={drop.x}
              cy="98"
              r="0.3"
              fill="none"
              stroke={currentColor}
              strokeWidth="0.1"
              style={{
                opacity: drop.opacity * 0.5,
                animation: `ripple 2s linear ${drop.delay}s infinite`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rainFall {
          0% {
            transform: translateY(-10%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110%);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          20% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(2);
            opacity: 0.5;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Rain;
