import React, { useRef, useEffect } from "react";
import { useTheme } from "../themes/themeContext/themeContext";

interface WaterEdgeAnimationProps {
  speed: number; // Speed factor for the wave
}

const WaterEdgeAnimation: React.FC<WaterEdgeAnimationProps> = ({ speed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = 200);

    let waveOffset = 0;
    const randomPhase = Math.random() * Math.PI * 2;

    const drawWave = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Create gradient from green to transparent
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, currentColors.top); // Top color
      gradient.addColorStop(1, currentColors.bottom); // Bottom color

      ctx.fillStyle = gradient;
      ctx.beginPath();

      const waveHeight = 20;
      const waveLength = 100;

      for (let x = 0; x < width; x++) {
        const y =
          Math.sin(
            (x + waveOffset) * ((Math.PI * 2) / waveLength) + randomPhase
          ) *
            waveHeight +
          waveHeight;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      ctx.fill();

      waveOffset += speed;
      requestAnimationFrame(drawWave);
    };

    drawWave();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, currentColors]);

  return <canvas ref={canvasRef} className="w-full" />;
};

export default WaterEdgeAnimation;
