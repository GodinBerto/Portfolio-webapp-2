"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import Live from "@/components/pageComponents/builder/live";
import {
  initializeFabric,
  handleCanvasMouseDown,
  handleResize,
} from "@/lib/canvas";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  useEffect(() => {
    const canvas = initializeFabric({ fabricRef, canvasRef });
    if (!canvas) return;

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        isDrawing,
        canvas,
        shapeRef,
        selectedShapeRef,
      });
    });

    const resizeHandler = () => handleResize({ fabricRef });
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <Live canvasRef={canvasRef} />
    </div>
  );
}
