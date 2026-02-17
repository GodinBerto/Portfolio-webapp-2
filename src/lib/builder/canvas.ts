import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/builder";
import { defaultNavElement } from "@/constants/builder";
import { createSpecificShape } from "./shapes";

type FabricObjectWithId = fabric.Object & { objectId?: string };

const ensureObjectId = (object: fabric.Object | null | undefined) => {
  const resolvedObject = object as FabricObjectWithId | null;
  if (!resolvedObject) return;

  if (!resolvedObject.objectId) {
    resolvedObject.objectId = uuidv4();
  }
};

export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  if (!canvasRef.current) return null;

  const canvas = new fabric.Canvas(canvasRef.current, {
    selection: true,
    preserveObjectStacking: true,
  });

  const parent = canvasRef.current.parentElement;
  if (parent) {
    canvas.setDimensions({
      width: parent.clientWidth,
      height: parent.clientHeight,
    });
  }

  fabricRef.current = canvas;
  return canvas;
};

export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  const pointer = canvas.getPointer(options.e);
  const target = canvas.findTarget(options.e);

  if (selectedShapeRef === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    canvas.freeDrawingBrush.width = 3;
    canvas.freeDrawingBrush.color = "#111827";
    return;
  }

  canvas.isDrawingMode = false;

  if (target && (target.type === selectedShapeRef || target.type === "activeSelection")) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
    return;
  }

  isDrawing.current = true;
  shapeRef.current = createSpecificShape(selectedShapeRef, pointer as any);

  if (shapeRef.current) {
    ensureObjectId(shapeRef.current);
    canvas.add(shapeRef.current);
  }
};

export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  if (!isDrawing.current || selectedShapeRef === "freeform") return;

  const pointer = canvas.getPointer(options.e);
  const currentShape = shapeRef.current as FabricObjectWithId | null;
  if (!currentShape) return;

  switch (selectedShapeRef) {
    case "rectangle":
    case "triangle": {
      currentShape.set({
        width: Math.abs(pointer.x - (currentShape.left ?? 0)),
        height: Math.abs(pointer.y - (currentShape.top ?? 0)),
      });
      break;
    }

    case "circle": {
      currentShape.set({
        radius: Math.abs(pointer.x - (currentShape.left ?? 0)) / 2,
      } as any);
      break;
    }

    case "line": {
      currentShape.set({
        x2: pointer.x,
        y2: pointer.y,
      } as any);
      break;
    }

    default:
      break;
  }

  currentShape.setCoords();
  canvas.requestRenderAll();

  if (currentShape.objectId) {
    syncShapeInStorage(currentShape);
  }
};

export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;

  if (selectedShapeRef !== "freeform") {
    if (shapeRef.current) {
      syncShapeInStorage(shapeRef.current);
    }

    shapeRef.current = null;
    activeObjectRef.current = null;
  }

  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 250);
  }
};

export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target;
  if (!target || target.type === "activeSelection") return;

  syncShapeInStorage(target);
};

export const handlePathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  const path = options.path;
  if (!path) return;

  ensureObjectId(path);
  syncShapeInStorage(path);
};

export const handleCanvasObjectMoving = ({
  options,
}: {
  options: fabric.TEvent<MouseEvent> & { target: fabric.Object };
}) => {
  const target = options.target;
  if (!target) return;

  const canvas = target.canvas as fabric.Canvas;
  target.setCoords();

  if (target.left != null) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width ?? 0) - (target.getScaledWidth() || target.width || 0)
      )
    );
  }

  if (target.top != null) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height ?? 0) - (target.getScaledHeight() || target.height || 0)
      )
    );
  }
};

export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  if (isEditingRef.current || !options.selected || options.selected.length === 0) {
    return;
  }

  const selectedElement = options.selected[0] as fabric.Object;
  if (!selectedElement || options.selected.length !== 1) return;

  const scaledWidth = selectedElement.scaleX
    ? selectedElement.width! * selectedElement.scaleX
    : selectedElement.width;

  const scaledHeight = selectedElement.scaleY
    ? selectedElement.height! * selectedElement.scaleY
    : selectedElement.height;

  setElementAttributes({
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
    fill: typeof selectedElement.fill === "string" ? selectedElement.fill : "",
    stroke: typeof selectedElement.stroke === "string" ? selectedElement.stroke : "",
    fontSize: String((selectedElement as any).fontSize ?? ""),
    fontFamily: String((selectedElement as any).fontFamily ?? ""),
    fontWeight: String((selectedElement as any).fontWeight ?? ""),
  });
};

export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;

  const scaledWidth = selectedElement?.scaleX
    ? selectedElement.width! * selectedElement.scaleX
    : selectedElement?.width;

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement.height! * selectedElement.scaleY
    : selectedElement?.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};

export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {
  if (!fabricRef.current) return;

  fabricRef.current.clear();

  if (canvasObjects instanceof Map) {
    Array.from(canvasObjects.values()).forEach((value) => {
      if (value && typeof value === "object") {
        // intentionally left blank - this is a compatibility fallback
      }
    });
  }

  if (activeObjectRef.current) {
    activeObjectRef.current.setCoords();
  }

  fabricRef.current.requestRenderAll();
};

export const handleResize = ({
  fabricRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
}) => {
  const canvas = fabricRef.current;
  const element = canvas?.getElement();
  const parent = element?.parentElement;
  if (!canvas || !parent) return;

  canvas.setDimensions({
    width: parent.clientWidth,
    height: parent.clientHeight,
  });
  canvas.requestRenderAll();
};

export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: fabric.TEvent<WheelEvent> & {
    e: WheelEvent;
  };
  canvas: fabric.Canvas;
}) => {
  const delta = options.e.deltaY;
  let zoom = canvas.getZoom();

  zoom = Math.min(Math.max(0.2, zoom + delta * 0.001), 4);
  const point = new fabric.Point(options.e.offsetX, options.e.offsetY);
  canvas.zoomToPoint(point, zoom);

  options.e.preventDefault();
  options.e.stopPropagation();
};
