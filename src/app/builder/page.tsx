"use client";

import { useCallback, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import Live from "@/components/pageComponents/builder/live";
import { setupCanvasPan } from "@/lib/builder/canvasPan";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  ActiveCanvasObject,
  BuilderTool,
  clearActiveObject,
  setActiveObject,
  setHistoryState,
  setIsDrawing,
  setLayers,
  setSelectedTool,
} from "@/store/slice/builder/canvasSlice";
import { resetBuilderRuntime, setBuilderRuntime } from "@/lib/builder/runtime";

type FabricObjectWithId = fabric.Object & { objectId?: string };

const objectColorValue = (color: unknown, fallback = "") =>
  typeof color === "string" ? color : fallback;

const objectWithId = (object: fabric.Object | null | undefined) =>
  object as FabricObjectWithId | null;

const ensureObjectId = (object: fabric.Object | null | undefined) => {
  const resolvedObject = objectWithId(object);
  if (!resolvedObject) return null;

  if (!resolvedObject.objectId) {
    resolvedObject.objectId = uuidv4();
  }

  return resolvedObject.objectId;
};

const dimensionsFromObject = (object: fabric.Object) => ({
  width: Math.max(0, (object.width ?? 0) * (object.scaleX ?? 1)),
  height: Math.max(0, (object.height ?? 0) * (object.scaleY ?? 1)),
});

const toActiveObjectPayload = (
  object: fabric.Object | null
): ActiveCanvasObject | null => {
  const resolvedObject = objectWithId(object);
  if (!resolvedObject) return null;
  const objectId = ensureObjectId(resolvedObject);
  if (!objectId) return null;

  const { width, height } = dimensionsFromObject(resolvedObject);
  const payload: ActiveCanvasObject = {
    id: objectId,
    type: resolvedObject.type ?? "object",
    left: resolvedObject.left ?? 0,
    top: resolvedObject.top ?? 0,
    width,
    height,
    angle: resolvedObject.angle ?? 0,
    opacity: resolvedObject.opacity ?? 1,
    fill: objectColorValue(resolvedObject.fill),
    stroke: objectColorValue(resolvedObject.stroke),
    strokeWidth: resolvedObject.strokeWidth ?? 0,
  };

  const textObject = resolvedObject as fabric.IText;
  if (typeof textObject.text === "string") {
    payload.text = textObject.text;
    payload.fontSize = textObject.fontSize ?? 16;
    payload.fontFamily = textObject.fontFamily ?? "Helvetica";
    payload.fontWeight = String(textObject.fontWeight ?? "400");
  }

  return payload;
};

const snapshotCanvas = (canvas: fabric.Canvas) =>
  JSON.stringify(canvas.toJSON());

const createDrawableObject = (
  tool: BuilderTool,
  point: { x: number; y: number }
): fabric.Object | null => {
  const sharedShapeProps = {
    left: point.x,
    top: point.y,
    fill: "rgba(37, 99, 235, 0.20)",
    stroke: "#2563eb",
    strokeWidth: 2,
  };

  if (tool === "rectangle") {
    return new fabric.Rect({
      ...sharedShapeProps,
      width: 1,
      height: 1,
    });
  }

  if (tool === "triangle") {
    return new fabric.Triangle({
      ...sharedShapeProps,
      width: 1,
      height: 1,
    });
  }

  if (tool === "circle") {
    return new fabric.Circle({
      ...sharedShapeProps,
      radius: 1,
    });
  }

  if (tool === "line") {
    return new fabric.Line([point.x, point.y, point.x, point.y], {
      stroke: "#2563eb",
      strokeWidth: 2,
    });
  }

  return null;
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawingRef = useRef(false);
  const shapeRef = useRef<FabricObjectWithId | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const restoringHistoryRef = useRef(false);
  const batchMutationRef = useRef(false);
  const selectedToolRef = useRef<BuilderTool>("select");

  const dispatch = useDispatch();
  const selectedTool = useSelector(
    (state: RootState) => state.canvas.selectedTool
  );

  const syncCanvasState = useCallback(
    (canvas: fabric.Canvas) => {
      const objects = canvas.getObjects();
      const layers = [...objects].reverse().map((object, index) => {
        const objectId = ensureObjectId(object) ?? `${object.type}-${index}`;
        const rawType = object.type ?? "object";
        const type = rawType
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          id: objectId,
          name: `${type} ${index + 1}`,
          type: rawType,
          visible: object.visible !== false,
        };
      });

      dispatch(setLayers(layers));

      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type !== "activeSelection") {
        dispatch(setActiveObject(toActiveObjectPayload(activeObject)));
      } else {
        dispatch(clearActiveObject());
      }
    },
    [dispatch]
  );

  const syncHistoryAvailability = useCallback(() => {
    dispatch(
      setHistoryState({
        canUndo: historyIndexRef.current > 0,
        canRedo:
          historyIndexRef.current >= 0 &&
          historyIndexRef.current < historyRef.current.length - 1,
      })
    );
  }, [dispatch]);

  const pushHistory = useCallback(
    (canvas: fabric.Canvas) => {
      if (restoringHistoryRef.current) return;

      const nextSnapshot = snapshotCanvas(canvas);
      const currentSnapshot = historyRef.current[historyIndexRef.current];
      if (nextSnapshot === currentSnapshot) {
        syncHistoryAvailability();
        return;
      }

      historyRef.current = historyRef.current.slice(
        0,
        historyIndexRef.current + 1
      );
      historyRef.current.push(nextSnapshot);
      historyIndexRef.current = historyRef.current.length - 1;
      syncHistoryAvailability();
    },
    [syncHistoryAvailability]
  );

  const restoreHistoryAt = useCallback(
    async (nextIndex: number) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      if (nextIndex < 0 || nextIndex >= historyRef.current.length) return;

      const snapshot = historyRef.current[nextIndex];
      if (!snapshot) return;

      restoringHistoryRef.current = true;
      try {
        await canvas.loadFromJSON(snapshot);
        canvas.requestRenderAll();
        historyIndexRef.current = nextIndex;
        syncCanvasState(canvas);
      } finally {
        restoringHistoryRef.current = false;
        syncHistoryAvailability();
      }
    },
    [syncCanvasState, syncHistoryAvailability]
  );

  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    batchMutationRef.current = true;
    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      selection.getObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
    } else {
      canvas.remove(activeObject);
    }
    batchMutationRef.current = false;

    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [pushHistory, syncCanvasState]);

  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (canvas.getObjects().length === 0) return;

    batchMutationRef.current = true;
    canvas.getObjects().forEach((object) => canvas.remove(object));
    canvas.discardActiveObject();
    batchMutationRef.current = false;

    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [pushHistory, syncCanvasState]);

  const bringToFront = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    (activeObject as any).bringToFront();
    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [pushHistory, syncCanvasState]);

  const sendToBack = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    (activeObject as any).sendToBack();
    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [pushHistory, syncCanvasState]);

  const selectObjectById = useCallback(
    (objectId: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const object = canvas
        .getObjects()
        .find(
          (canvasObject) => objectWithId(canvasObject)?.objectId === objectId
        );

      if (!object) return;

      canvas.setActiveObject(object);
      object.setCoords();
      canvas.requestRenderAll();
      syncCanvasState(canvas);
    },
    [syncCanvasState]
  );

  const updateActiveObject = useCallback(
    (updates: Partial<ActiveCanvasObject>) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const activeObject = canvas.getActiveObject();
      if (!activeObject || activeObject.type === "activeSelection") return;

      if (typeof updates.left === "number") {
        activeObject.set("left", updates.left);
      }
      if (typeof updates.top === "number") {
        activeObject.set("top", updates.top);
      }
      if (typeof updates.angle === "number") {
        activeObject.set("angle", updates.angle);
      }
      if (typeof updates.opacity === "number") {
        activeObject.set("opacity", Math.max(0, Math.min(1, updates.opacity)));
      }
      if (typeof updates.strokeWidth === "number") {
        activeObject.set("strokeWidth", Math.max(0, updates.strokeWidth));
      }
      if (typeof updates.fill === "string") {
        activeObject.set("fill", updates.fill);
      }
      if (typeof updates.stroke === "string") {
        activeObject.set("stroke", updates.stroke);
      }
      if (typeof updates.width === "number" && updates.width > 0) {
        const baseWidth = activeObject.width ?? 1;
        if (baseWidth > 0) {
          activeObject.set("scaleX", updates.width / baseWidth);
        }
      }
      if (typeof updates.height === "number" && updates.height > 0) {
        const baseHeight = activeObject.height ?? 1;
        if (baseHeight > 0) {
          activeObject.set("scaleY", updates.height / baseHeight);
        }
      }

      const textObject = activeObject as fabric.IText;
      if (typeof updates.text === "string" && typeof textObject.text === "string") {
        textObject.set("text", updates.text);
      }
      if (
        typeof updates.fontSize === "number" &&
        typeof textObject.text === "string"
      ) {
        textObject.set("fontSize", updates.fontSize);
      }
      if (
        typeof updates.fontFamily === "string" &&
        typeof textObject.text === "string"
      ) {
        textObject.set("fontFamily", updates.fontFamily);
      }
      if (
        typeof updates.fontWeight === "string" &&
        typeof textObject.text === "string"
      ) {
        textObject.set("fontWeight", updates.fontWeight);
      }

      activeObject.setCoords();
      canvas.requestRenderAll();
      syncCanvasState(canvas);
      pushHistory(canvas);
    },
    [pushHistory, syncCanvasState]
  );

  const duplicateSelected = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    try {
      const clonedObject = (await (activeObject as any).clone()) as fabric.Object;
      ensureObjectId(clonedObject);
      clonedObject.set({
        left: (activeObject.left ?? 0) + 20,
        top: (activeObject.top ?? 0) + 20,
      });
      canvas.add(clonedObject);
      canvas.setActiveObject(clonedObject);
      canvas.requestRenderAll();
      syncCanvasState(canvas);
      pushHistory(canvas);
    } catch {
      // clone can fail for unsupported object types
    }
  }, [pushHistory, syncCanvasState]);

  const addImageFromFile = useCallback(
    (file: File) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result !== "string") return;

        const image = await fabric.Image.fromURL(reader.result);
        ensureObjectId(image);

        const maxWidth = Math.max(220, canvas.getWidth() * 0.35);
        if ((image.width ?? 0) > maxWidth) {
          image.scaleToWidth(maxWidth);
        }

        image.set({
          left: canvas.getWidth() / 2 - image.getScaledWidth() / 2,
          top: canvas.getHeight() / 2 - image.getScaledHeight() / 2,
        });

        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.requestRenderAll();
        syncCanvasState(canvas);
        pushHistory(canvas);
      };

      reader.readAsDataURL(file);
    },
    [pushHistory, syncCanvasState]
  );

  const undo = useCallback(() => {
    const nextIndex = historyIndexRef.current - 1;
    void restoreHistoryAt(nextIndex);
  }, [restoreHistoryAt]);

  const redo = useCallback(() => {
    const nextIndex = historyIndexRef.current + 1;
    void restoreHistoryAt(nextIndex);
  }, [restoreHistoryAt]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: true,
    });

    const resizeCanvas = () => {
      const parent = canvasRef.current?.parentElement;
      if (!parent) return;

      const width = Math.max(0, parent.clientWidth);
      const height = Math.max(0, parent.clientHeight);

      canvas.setDimensions({ width, height });
      canvas.calcOffset();

      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.width = `${width}px`;
        canvas.wrapperEl.style.height = `${height}px`;
        canvas.wrapperEl.style.position = "absolute";
        canvas.wrapperEl.style.inset = "0";
      }

      if (canvas.lowerCanvasEl) {
        canvas.lowerCanvasEl.style.width = `${width}px`;
        canvas.lowerCanvasEl.style.height = `${height}px`;
      }

      if (canvas.upperCanvasEl) {
        canvas.upperCanvasEl.style.width = `${width}px`;
        canvas.upperCanvasEl.style.height = `${height}px`;
        canvas.upperCanvasEl.style.background = "transparent";
      }

      canvas.requestRenderAll();
    };

    resizeCanvas();
    fabricRef.current = canvas;
    const parent = canvasRef.current.parentElement;
    const resizeObserver =
      parent && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resizeCanvas())
        : null;
    resizeObserver?.observe(parent!);
    requestAnimationFrame(resizeCanvas);

    const onSelection = () => syncCanvasState(canvas);

    const onMouseDown = (event: fabric.TEvent) => {
      const nativeEvent = event.e as MouseEvent | undefined;
      if (nativeEvent?.altKey) return;

      const currentTool = selectedToolRef.current;
      if (currentTool === "select" || currentTool === "image") return;

      const pointer = canvas.getPointer(event.e);
      if (currentTool === "text") {
        const text = new fabric.IText("Text", {
          left: pointer.x,
          top: pointer.y,
          fill: "#111827",
          fontFamily: "Helvetica",
          fontSize: 24,
          fontWeight: "400",
        });

        ensureObjectId(text);
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        canvas.requestRenderAll();
        syncCanvasState(canvas);
        pushHistory(canvas);
        return;
      }

      if (currentTool === "freeform") {
        canvas.isDrawingMode = true;
        return;
      }

      const shape = createDrawableObject(currentTool, pointer);
      if (!shape) return;

      ensureObjectId(shape);
      canvas.discardActiveObject();
      canvas.add(shape);
      canvas.setActiveObject(shape);
      shapeRef.current = objectWithId(shape);
      startPointRef.current = { x: pointer.x, y: pointer.y };
      isDrawingRef.current = true;
      dispatch(setIsDrawing(true));
    };

    const onMouseMove = (event: fabric.TEvent) => {
      if (!isDrawingRef.current || !shapeRef.current || !startPointRef.current) {
        return;
      }

      if (selectedToolRef.current === "freeform") return;

      const pointer = canvas.getPointer(event.e);
      const { x: startX, y: startY } = startPointRef.current;
      const currentShape = shapeRef.current;

      if (currentShape instanceof fabric.Line) {
        currentShape.set({
          x2: pointer.x,
          y2: pointer.y,
        });
      } else if (currentShape instanceof fabric.Circle) {
        const radius = Math.max(
          1,
          Math.max(Math.abs(pointer.x - startX), Math.abs(pointer.y - startY)) / 2
        );

        currentShape.set({
          radius,
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y),
        });
      } else {
        const width = Math.abs(pointer.x - startX);
        const height = Math.abs(pointer.y - startY);
        currentShape.set({
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y),
          width: Math.max(1, width),
          height: Math.max(1, height),
        });
      }

      currentShape.setCoords();
      canvas.requestRenderAll();
    };

    const onMouseUp = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      dispatch(setIsDrawing(false));

      const currentShape = shapeRef.current;
      shapeRef.current = null;
      startPointRef.current = null;

      if (!currentShape) return;

      const { width, height } = dimensionsFromObject(currentShape);
      const isTinyLine =
        currentShape instanceof fabric.Line &&
        Math.abs((currentShape.x2 ?? 0) - (currentShape.x1 ?? 0)) < 2 &&
        Math.abs((currentShape.y2 ?? 0) - (currentShape.y1 ?? 0)) < 2;

      if (
        (width < 2 && height < 2 && !(currentShape instanceof fabric.Line)) ||
        isTinyLine
      ) {
        canvas.remove(currentShape);
      }

      canvas.requestRenderAll();
      syncCanvasState(canvas);
      pushHistory(canvas);
    };

    const onObjectAdded = (
      event: fabric.TEvent & { target?: fabric.Object }
    ) => {
      const target = event.target;
      if (!target) return;
      ensureObjectId(target);
      syncCanvasState(canvas);
    };

    const onObjectRemoved = () => {
      syncCanvasState(canvas);
      if (!restoringHistoryRef.current && !batchMutationRef.current) {
        pushHistory(canvas);
      }
    };

    const onObjectModified = () => {
      syncCanvasState(canvas);
      if (!restoringHistoryRef.current && !batchMutationRef.current) {
        pushHistory(canvas);
      }
    };

    const onPathCreated = (
      event: fabric.TEvent & { path?: fabric.Path }
    ) => {
      if (!event.path) return;
      ensureObjectId(event.path);
      syncCanvasState(canvas);
      if (!restoringHistoryRef.current) {
        pushHistory(canvas);
      }
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    canvas.on("selection:created", onSelection);
    canvas.on("selection:updated", onSelection);
    canvas.on("selection:cleared", onSelection);

    canvas.on("object:added", onObjectAdded as any);
    canvas.on("object:removed", onObjectRemoved as any);
    canvas.on("object:modified", onObjectModified as any);
    canvas.on("path:created", onPathCreated as any);

    setupCanvasPan(canvas);
    window.addEventListener("resize", resizeCanvas);

    historyRef.current = [snapshotCanvas(canvas)];
    historyIndexRef.current = 0;
    syncHistoryAvailability();
    syncCanvasState(canvas);

    setBuilderRuntime({
      deleteSelected,
      clearCanvas,
      undo,
      redo,
      duplicateSelected,
      selectObjectById,
      updateActiveObject,
      bringToFront,
      sendToBack,
      addImageFromFile,
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      resizeObserver?.disconnect();
      resetBuilderRuntime();
      canvas.dispose();
    };
  }, [
    addImageFromFile,
    bringToFront,
    clearCanvas,
    deleteSelected,
    dispatch,
    duplicateSelected,
    pushHistory,
    redo,
    selectObjectById,
    sendToBack,
    syncCanvasState,
    syncHistoryAvailability,
    undo,
    updateActiveObject,
  ]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;

    const canvas = fabricRef.current;
    if (!canvas) return;

    const freeformMode = selectedTool === "freeform";
    canvas.isDrawingMode = freeformMode;
    canvas.selection = selectedTool === "select";
    canvas.skipTargetFind = !(
      selectedTool === "select" || selectedTool === "freeform"
    );
    canvas.defaultCursor = selectedTool === "select" ? "default" : "crosshair";

    if (freeformMode) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "#111827";
    }

    canvas.requestRenderAll();
  }, [selectedTool]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();
      const withMeta = event.ctrlKey || event.metaKey;

      if (withMeta && key === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (withMeta && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (withMeta && key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (key === "delete" || key === "backspace") {
        deleteSelected();
        return;
      }

      if (key === "v") {
        dispatch(setSelectedTool("select"));
      } else if (key === "r") {
        dispatch(setSelectedTool("rectangle"));
      } else if (key === "c") {
        dispatch(setSelectedTool("circle"));
      } else if (key === "t") {
        dispatch(setSelectedTool("triangle"));
      } else if (key === "l") {
        dispatch(setSelectedTool("line"));
      } else if (key === "p") {
        dispatch(setSelectedTool("freeform"));
      } else if (key === "x") {
        dispatch(setSelectedTool("text"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelected, dispatch, redo, undo]);

  return (
    <div className="h-full w-full">
      <Live canvasRef={canvasRef} />
    </div>
  );
}
