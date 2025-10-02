"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import Live from "@/components/pageComponents/builder/live";
import {
  initializeFabric,
  handleCanvasMouseDown,
  handleResize,
  handleCanvaseMouseMove,
  handleCanvasMouseUp,
} from "@/lib/builder/canvas";
import { setupCanvasPan } from "@/lib/builder/canvasPan";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useSelector(
    (state: RootState) => state.canvas.selectedShapeRef
  );

  // ✅ FIX: Declare syncShapeInStorage
  const syncShapeInStorage = (shape: fabric.Object | null) => {
    if (!shape) return;
    console.log("Syncing shape:", shape.toJSON());
    // later => dispatch Redux action here
  };

  // ✅ FIX: Declare setActiveElement
  const setActiveElement = (element: any) => {
    console.log("Set active element:", element);
    // later => update UI state here
  };

  useEffect(() => {
    const canvas = initializeFabric({ fabricRef, canvasRef });
    if (!canvas) return;

    // ✅ Shapes drawing
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        isDrawing,
        canvas,
        shapeRef,
        selectedShapeRef,
      });
    });

    // canvas.on("mouse:move", (options) =>
    //   handleCanvaseMouseMove({
    //     options,
    //     canvas,
    //     isDrawing,
    //     selectedShapeRef,
    //     shapeRef,
    //     syncShapeInStorage,
    //   })
    // );

    // canvas.on("mouse:up", (options) =>
    //   handleCanvasMouseUp({
    //     canvas,
    //     isDrawing,
    //     shapeRef,
    //     activeObjectRef,
    //     selectedShapeRef,
    //     syncShapeInStorage,
    //     setActiveElement,
    //   })
    // );

    // ✅ Pan + zoom setup
    setupCanvasPan(canvas);

    // ✅ Resize handler
    const resizeHandler = () => handleResize({ fabricRef });
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      canvas.dispose();
    };
  }, [selectedShapeRef]);

  return (
    <div>
      <Live canvasRef={canvasRef} />
    </div>
  );
}
