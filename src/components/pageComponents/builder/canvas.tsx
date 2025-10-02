"use client";
import { useEffect } from "react";

export default function Canvas({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) {
  const window = globalThis.window;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Match drawing buffer to CSS size in pixels
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize(); // set once at mount
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef, window]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-[60px] bottom-0 w-screen h-[calc(100%-60px)] dark:bg-black"
      style={{ display: "block" }}
    />
  );
}
