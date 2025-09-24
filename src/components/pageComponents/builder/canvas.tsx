export default function Canvas({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) {
  return (
    <>
      <canvas ref={canvasRef}>
        <div>Canvas</div>
      </canvas>
    </>
  );
}
