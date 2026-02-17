"use client";

export default function Canvas({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) {
  return (
    <canvas
      id="builder-canvas"
      ref={canvasRef}
      className="h-full w-full touch-none"
      style={{ display: "block" }}
    />
  );
}
