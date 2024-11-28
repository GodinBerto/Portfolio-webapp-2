import React, { useRef, useEffect } from "react";

interface WaterEdgeAnimationProps {
  speed: number; // Speed factor for the wave
}

const WaterEdgeAnimation: React.FC<WaterEdgeAnimationProps> = ({ speed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = 200);

    let waveOffset = 0;
    const randomPhase = Math.random() * Math.PI * 2; // Random phase offset

    const drawWave = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Create gradient from green to transparent
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(34, 197, 94, 1)"); // Green (top)
      gradient.addColorStop(1, "rgba(34, 197, 94, 0)"); // Transparent Green (bottom)

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

      waveOffset += speed; // Adjust wave animation speed
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
  }, [speed]);

  return <canvas ref={canvasRef} className="w-full" />;
};

export default WaterEdgeAnimation;
