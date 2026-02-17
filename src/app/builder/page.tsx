"use client";

import { useCallback, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import Live from "@/components/pageComponents/builder/live";
import { setupCanvasPan } from "@/lib/builder/canvasPan";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  ActiveCanvasObject,
  BuilderTool,
  FramePreset,
  clearActiveObject,
  setActiveObject,
  setHistoryState,
  setIsDrawing,
  setLayers,
  setSelectedTool,
} from "@/store/slice/builder/canvasSlice";
import { resetBuilderRuntime, setBuilderRuntime } from "@/lib/builder/runtime";

type CanvasSyncRequestEvent = {
  type: "builder:canvas-sync-request";
  sender: string;
};

type CanvasSyncEvent = {
  type: "builder:canvas-sync";
  sender: string;
  snapshot: string;
};

type CanvasRealtimeEvent = CanvasSyncRequestEvent | CanvasSyncEvent;

type FabricObjectWithMeta = fabric.Object & {
  objectId?: string;
  parentFrameId?: string | null;
  isFrame?: boolean;
  framePreset?: FramePreset;
  objectName?: string;
};

type FrameFabricObject = FabricObjectWithMeta & {
  isFrame: true;
};

const BUILDER_CUSTOM_PROPERTIES = [
  "objectId",
  "parentFrameId",
  "isFrame",
  "framePreset",
  "objectName",
] as const;

const FRAME_PRESETS: Record<
  "frameDesktop" | "frameTablet" | "frameMobile",
  { preset: FramePreset; label: string; width: number; height: number }
> = {
  frameDesktop: {
    preset: "desktop",
    label: "Desktop Frame",
    width: 1440,
    height: 1024,
  },
  frameTablet: {
    preset: "tablet",
    label: "Tablet Frame",
    width: 834,
    height: 1112,
  },
  frameMobile: {
    preset: "mobile",
    label: "Mobile Frame",
    width: 390,
    height: 844,
  },
};

const isFrameTool = (
  tool: BuilderTool
): tool is "frameDesktop" | "frameTablet" | "frameMobile" =>
  tool === "frameDesktop" || tool === "frameTablet" || tool === "frameMobile";

const objectColorValue = (color: unknown, fallback = "") =>
  typeof color === "string" ? color : fallback;

const objectWithId = (object: fabric.Object | null | undefined) =>
  object as FabricObjectWithMeta | null;

const isFrameObject = (
  object: fabric.Object | null | undefined
): object is FrameFabricObject => objectWithId(object)?.isFrame === true;

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
    name: resolvedObject.objectName ?? resolvedObject.type ?? "Layer",
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
    parentId: resolvedObject.parentFrameId ?? null,
    isFrame: resolvedObject.isFrame === true,
    framePreset: resolvedObject.framePreset,
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

const createStarPoints = (spikes = 5, outerRadius = 56, innerRadius = 24) => {
  const points: { x: number; y: number }[] = [];
  const step = Math.PI / spikes;

  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    points.push({
      x: outerRadius + Math.cos(angle) * radius,
      y: outerRadius + Math.sin(angle) * radius,
    });
  }

  return points;
};

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

  if (tool === "diamond") {
    return new fabric.Rect({
      ...sharedShapeProps,
      width: 1,
      height: 1,
      angle: 45,
    });
  }

  if (tool === "star") {
    return new fabric.Polygon(createStarPoints(), {
      ...sharedShapeProps,
      width: 112,
      height: 112,
      originX: "left",
      originY: "top",
      scaleX: 0.01,
      scaleY: 0.01,
    });
  }

  if (tool === "arrow") {
    return new fabric.Path("M 0 18 L 74 18 L 74 6 L 110 28 L 74 50 L 74 38 L 0 38 z", {
      left: point.x,
      top: point.y,
      fill: "rgba(37, 99, 235, 0.20)",
      stroke: "#2563eb",
      strokeWidth: 2,
      originX: "left",
      originY: "top",
      scaleX: 0.01,
      scaleY: 0.01,
    });
  }

  return null;
};

const createFrameObject = (
  tool: "frameDesktop" | "frameTablet" | "frameMobile",
  point: { x: number; y: number }
) => {
  const preset = FRAME_PRESETS[tool];

  return new fabric.Rect({
    left: point.x,
    top: point.y,
    width: preset.width,
    height: preset.height,
    rx: 0,
    ry: 0,
    fill: "#ffffff",
    stroke: "#334155",
    strokeWidth: 1.5,
    shadow: new fabric.Shadow({
      color: "rgba(15, 23, 42, 0.12)",
      blur: 10,
      offsetX: 0,
      offsetY: 4,
    }),
    selectable: true,
  }) as FabricObjectWithMeta;
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawingRef = useRef(false);
  const shapeRef = useRef<FabricObjectWithMeta | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const restoringHistoryRef = useRef(false);
  const applyingRemoteSnapshotRef = useRef(false);
  const batchMutationRef = useRef(false);
  const selectedToolRef = useRef<BuilderTool>("select");
  const sessionIdRef = useRef(uuidv4());
  const pendingBroadcastFrameRef = useRef<number | null>(null);
  const lastBroadcastSnapshotRef = useRef<string>("");
  const remoteSnapshotChainRef = useRef<Promise<void>>(Promise.resolve());
  const hasRequestedInitialSyncRef = useRef(false);
  const frameDragRef = useRef<{
    frameId: string;
    left: number;
    top: number;
  } | null>(null);
  const drawToolRef = useRef<BuilderTool | null>(null);

  const broadcast = useBroadcastEvent();
  const dispatch = useDispatch();
  const selectedTool = useSelector(
    (state: RootState) => state.canvas.selectedTool
  );

  const getFrameChildren = useCallback(
    (canvas: fabric.Canvas, frameId: string) =>
      canvas
        .getObjects()
        .filter((item) => objectWithId(item)?.parentFrameId === frameId),
    []
  );

  const frameClipRect = useCallback((frame: fabric.Object) => {
    const bounds = frame.getBoundingRect();

    return new fabric.Rect({
      left: bounds.left,
      top: bounds.top,
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      absolutePositioned: true,
      rx: 0,
      ry: 0,
    });
  }, []);

  const syncFrameChildrenClipping = useCallback(
    (canvas: fabric.Canvas, frame: fabric.Object) => {
      const frameId = ensureObjectId(frame);
      if (!frameId) return;

      getFrameChildren(canvas, frameId).forEach((child) => {
        if (child === frame) return;
        child.clipPath = frameClipRect(frame);
        child.setCoords();
      });
    },
    [frameClipRect, getFrameChildren]
  );

  const syncAllFrameRelations = useCallback(
    (canvas: fabric.Canvas) => {
      const frames = canvas.getObjects().filter((item) => isFrameObject(item));
      const frameById = new Map(
        frames
          .map((frame) => [ensureObjectId(frame), frame] as const)
          .filter(
            (entry): entry is [string, FrameFabricObject] => Boolean(entry[0])
          )
      );

      canvas.getObjects().forEach((item) => {
        const meta = objectWithId(item);
        if (!meta) return;

        if (meta.parentFrameId && frameById.has(meta.parentFrameId)) {
          const frame = frameById.get(meta.parentFrameId)!;
          meta.clipPath = frameClipRect(frame);
          meta.setCoords();
          return;
        }

        if (meta.parentFrameId && !frameById.has(meta.parentFrameId)) {
          meta.parentFrameId = null;
        }

        if (!isFrameObject(meta)) {
          meta.clipPath = undefined;
        }
      });
    },
    [frameClipRect]
  );

  const frameContainingPoint = useCallback(
    (canvas: fabric.Canvas, point: { x: number; y: number }) => {
      const frames = canvas
        .getObjects()
        .filter((item) => isFrameObject(item))
        .reverse();

      return (
        frames.find((frame) => {
          const bounds = frame.getBoundingRect();
          return (
            point.x >= bounds.left &&
            point.x <= bounds.left + bounds.width &&
            point.y >= bounds.top &&
            point.y <= bounds.top + bounds.height
          );
        }) ?? null
      );
    },
    []
  );

  const frameForObject = useCallback(
    (canvas: fabric.Canvas, object: fabric.Object | null | undefined) => {
      const parentFrameId = objectWithId(object)?.parentFrameId;
      if (!parentFrameId) return null;

      return (
        canvas
          .getObjects()
          .find((item) => objectWithId(item)?.objectId === parentFrameId) ?? null
      );
    },
    []
  );

  const assignObjectToFrame = useCallback(
    (
      object: fabric.Object,
      frame: fabric.Object | null,
      options?: { keepCurrentFrame?: boolean }
    ) => {
      const meta = objectWithId(object);
      if (!meta || isFrameObject(meta)) return;

      if (!frame) {
        if (!options?.keepCurrentFrame) {
          meta.parentFrameId = null;
          meta.clipPath = undefined;
        }
        return;
      }

      const frameId = ensureObjectId(frame);
      if (!frameId) return;

      meta.parentFrameId = frameId;
      meta.clipPath = frameClipRect(frame);
    },
    [frameClipRect]
  );

  const syncCanvasState = useCallback(
    (canvas: fabric.Canvas) => {
      const objects = canvas.getObjects();
      const layers = [...objects].reverse().map((object, index) => {
        const objectId = ensureObjectId(object) ?? `${object.type}-${index}`;
        const meta = objectWithId(object);
        const rawType = object.type ?? "object";
        const type = rawType
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          id: objectId,
          name: meta?.objectName ?? `${type} ${index + 1}`,
          type: rawType,
          visible: object.visible !== false,
          parentId: meta?.parentFrameId ?? null,
          isFrame: meta?.isFrame === true,
          framePreset: meta?.framePreset,
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

  const broadcastSnapshot = useCallback(
    (canvas: fabric.Canvas, options?: { force?: boolean }) => {
      if (restoringHistoryRef.current || applyingRemoteSnapshotRef.current) {
        return;
      }

      const snapshot = snapshotCanvas(canvas);
      if (!options?.force && snapshot === lastBroadcastSnapshotRef.current) {
        return;
      }

      lastBroadcastSnapshotRef.current = snapshot;
      broadcast({
        type: "builder:canvas-sync",
        sender: sessionIdRef.current,
        snapshot,
      } satisfies CanvasSyncEvent);
    },
    [broadcast]
  );

  const queueSnapshotBroadcast = useCallback(
    (canvas: fabric.Canvas) => {
      if (pendingBroadcastFrameRef.current != null) return;

      pendingBroadcastFrameRef.current = window.requestAnimationFrame(() => {
        pendingBroadcastFrameRef.current = null;
        broadcastSnapshot(canvas);
      });
    },
    [broadcastSnapshot]
  );

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
      queueSnapshotBroadcast(canvas);
    },
    [queueSnapshotBroadcast, syncHistoryAvailability]
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
        syncAllFrameRelations(canvas);
        canvas.requestRenderAll();
        historyIndexRef.current = nextIndex;
        syncCanvasState(canvas);
      } finally {
        restoringHistoryRef.current = false;
        syncHistoryAvailability();
        broadcastSnapshot(canvas, { force: true });
      }
    },
    [
      broadcastSnapshot,
      syncAllFrameRelations,
      syncCanvasState,
      syncHistoryAvailability,
    ]
  );

  const applyRemoteSnapshot = useCallback(
    (snapshot: string) => {
      remoteSnapshotChainRef.current = remoteSnapshotChainRef.current
        .then(async () => {
          const canvas = fabricRef.current;
          if (!canvas) return;

          applyingRemoteSnapshotRef.current = true;
          restoringHistoryRef.current = true;
          try {
            await canvas.loadFromJSON(snapshot);
            syncAllFrameRelations(canvas);
            canvas.discardActiveObject();
            canvas.requestRenderAll();

            historyRef.current = [snapshot];
            historyIndexRef.current = 0;
            lastBroadcastSnapshotRef.current = snapshot;
            syncHistoryAvailability();
            syncCanvasState(canvas);
          } finally {
            restoringHistoryRef.current = false;
            applyingRemoteSnapshotRef.current = false;
          }
        })
        .catch(() => {
          restoringHistoryRef.current = false;
          applyingRemoteSnapshotRef.current = false;
        });
    },
    [syncAllFrameRelations, syncCanvasState, syncHistoryAvailability]
  );

  useEventListener((eventData) => {
    const event = eventData.event as CanvasRealtimeEvent;
    if (!event || typeof event !== "object" || !("type" in event)) {
      return;
    }

    if (event.sender === sessionIdRef.current) return;

    const canvas = fabricRef.current;
    if (!canvas) return;

    if (event.type === "builder:canvas-sync-request") {
      broadcastSnapshot(canvas, { force: true });
      return;
    }

    if (event.type === "builder:canvas-sync" && typeof event.snapshot === "string") {
      applyRemoteSnapshot(event.snapshot);
    }
  });

  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    batchMutationRef.current = true;
    if (activeObject.type === "activeSelection") {
      const selection = activeObject as fabric.ActiveSelection;
      const objectsToDelete = new Set<fabric.Object>(selection.getObjects());

      selection.getObjects().forEach((object) => {
        const objectId = ensureObjectId(object);
        if (!objectId || !isFrameObject(object)) return;

        getFrameChildren(canvas, objectId).forEach((child) =>
          objectsToDelete.add(child)
        );
      });

      objectsToDelete.forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
    } else {
      const frameId = ensureObjectId(activeObject);
      if (frameId && isFrameObject(activeObject)) {
        getFrameChildren(canvas, frameId).forEach((child) => canvas.remove(child));
      }
      canvas.remove(activeObject);
    }
    batchMutationRef.current = false;

    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [getFrameChildren, pushHistory, syncCanvasState]);

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

  const normalizeFrameStack = useCallback(
    (canvas: fabric.Canvas, frame: fabric.Object) => {
      const frameId = ensureObjectId(frame);
      if (!frameId) return;

      const children = getFrameChildren(canvas, frameId).sort(
        (left, right) =>
          canvas.getObjects().indexOf(left) - canvas.getObjects().indexOf(right)
      );

      children.forEach((child, offset) => {
        const frameIndex = canvas.getObjects().indexOf(frame);
        if (frameIndex < 0) return;
        canvas.moveObjectTo(child, frameIndex + offset + 1);
      });
    },
    [getFrameChildren]
  );

  const moveFrameBlock = useCallback(
    (canvas: fabric.Canvas, frame: fabric.Object, direction: "front" | "back") => {
      const frameId = ensureObjectId(frame);
      if (!frameId) return;

      const block = [frame, ...getFrameChildren(canvas, frameId)].sort(
        (left, right) =>
          canvas.getObjects().indexOf(left) - canvas.getObjects().indexOf(right)
      );

      if (direction === "front") {
        block.forEach((item) => canvas.bringObjectToFront(item));
      } else {
        [...block].reverse().forEach((item) => canvas.sendObjectToBack(item));
      }

      normalizeFrameStack(canvas, frame);
    },
    [getFrameChildren, normalizeFrameStack]
  );

  const bringToFront = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    if (isFrameObject(activeObject)) {
      moveFrameBlock(canvas, activeObject, "front");
    } else {
      const parentFrame = frameForObject(canvas, activeObject);

      if (parentFrame) {
        normalizeFrameStack(canvas, parentFrame);

        const frameIndex = canvas.getObjects().indexOf(parentFrame);
        if (frameIndex < 0) return;
        const parentId = ensureObjectId(parentFrame);
        const siblingCount = parentId
          ? getFrameChildren(canvas, parentId).filter((item) => item !== activeObject)
              .length
          : 0;

        canvas.moveObjectTo(activeObject, frameIndex + siblingCount + 1);
        normalizeFrameStack(canvas, parentFrame);
      } else {
        canvas.bringObjectToFront(activeObject);
      }
    }

    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [
    frameForObject,
    getFrameChildren,
    moveFrameBlock,
    normalizeFrameStack,
    pushHistory,
    syncCanvasState,
  ]);

  const sendToBack = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    if (isFrameObject(activeObject)) {
      moveFrameBlock(canvas, activeObject, "back");
    } else {
      const parentFrame = frameForObject(canvas, activeObject);

      if (parentFrame) {
        normalizeFrameStack(canvas, parentFrame);
        const frameIndex = canvas.getObjects().indexOf(parentFrame);
        if (frameIndex < 0) return;
        canvas.moveObjectTo(activeObject, frameIndex + 1);
        normalizeFrameStack(canvas, parentFrame);
      } else {
        canvas.sendObjectToBack(activeObject);
      }
    }

    canvas.requestRenderAll();
    syncCanvasState(canvas);
    pushHistory(canvas);
  }, [
    frameForObject,
    moveFrameBlock,
    normalizeFrameStack,
    pushHistory,
    syncCanvasState,
  ]);

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
    (
      updates: Partial<ActiveCanvasObject>,
      options?: {
        commitHistory?: boolean;
        syncStore?: boolean;
      }
    ) => {
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

      if (options?.syncStore !== false) {
        syncCanvasState(canvas);
      }
      if (options?.commitHistory !== false) {
        pushHistory(canvas);
      } else {
        queueSnapshotBroadcast(canvas);
      }
    },
    [pushHistory, queueSnapshotBroadcast, syncCanvasState]
  );

  const duplicateSelected = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type === "activeSelection") return;

    try {
      const activeMeta = objectWithId(activeObject);
      const sourceFrameId = ensureObjectId(activeObject);
      const clonedObject = (await (activeObject as any).clone()) as fabric.Object;
      const clonedMeta = objectWithId(clonedObject);

      const clonedId = ensureObjectId(clonedObject);
      if (clonedMeta && activeMeta) {
        clonedMeta.objectName = activeMeta.objectName
          ? `${activeMeta.objectName} Copy`
          : clonedMeta.objectName;
      }

      clonedObject.set({
        left: (activeObject.left ?? 0) + 20,
        top: (activeObject.top ?? 0) + 20,
      });
      canvas.add(clonedObject);

      if (isFrameObject(activeObject) && sourceFrameId && clonedId) {
        const sourceChildren = getFrameChildren(canvas, sourceFrameId);
        for (const child of sourceChildren) {
          const clonedChild = (await (child as any).clone()) as fabric.Object;
          ensureObjectId(clonedChild);
          const childMeta = objectWithId(clonedChild);

          if (childMeta) {
            childMeta.parentFrameId = clonedId;
            childMeta.objectName = childMeta.objectName
              ? `${childMeta.objectName} Copy`
              : childMeta.objectName;
          }

          clonedChild.set({
            left: (child.left ?? 0) + 20,
            top: (child.top ?? 0) + 20,
          });

          canvas.add(clonedChild);
          assignObjectToFrame(clonedChild, clonedObject, {
            keepCurrentFrame: true,
          });
        }
      } else {
        const parentFrame = frameForObject(canvas, activeObject);
        assignObjectToFrame(clonedObject, parentFrame, { keepCurrentFrame: true });
        if (parentFrame) {
          normalizeFrameStack(canvas, parentFrame);
        }
      }

      if (isFrameObject(clonedObject)) {
        syncFrameChildrenClipping(canvas, clonedObject);
      }

      canvas.setActiveObject(clonedObject);
      canvas.requestRenderAll();
      syncCanvasState(canvas);
      pushHistory(canvas);
    } catch {
      // clone can fail for unsupported object types
    }
  }, [
    assignObjectToFrame,
    frameForObject,
    getFrameChildren,
    normalizeFrameStack,
    pushHistory,
    syncCanvasState,
    syncFrameChildrenClipping,
  ]);

  const addImageFromFile = useCallback(
    (file: File) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result !== "string") return;

        const image = await fabric.Image.fromURL(reader.result);
        ensureObjectId(image);

        const active = canvas.getActiveObject();
        const activeFrame = isFrameObject(active)
          ? active
          : frameForObject(canvas, active);

        const maxWidth = activeFrame
          ? Math.max(160, activeFrame.getBoundingRect().width * 0.6)
          : Math.max(220, canvas.getWidth() * 0.35);
        if ((image.width ?? 0) > maxWidth) {
          image.scaleToWidth(maxWidth);
        }

        if (activeFrame) {
          const frameBounds = activeFrame.getBoundingRect();
          image.set({
            left: frameBounds.left + frameBounds.width / 2 - image.getScaledWidth() / 2,
            top:
              frameBounds.top +
              frameBounds.height / 2 -
              image.getScaledHeight() / 2,
          });
          assignObjectToFrame(image, activeFrame);
          normalizeFrameStack(canvas, activeFrame);
        } else {
          image.set({
            left: canvas.getWidth() / 2 - image.getScaledWidth() / 2,
            top: canvas.getHeight() / 2 - image.getScaledHeight() / 2,
          });
          assignObjectToFrame(image, null);
        }

        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.requestRenderAll();
        syncCanvasState(canvas);
        pushHistory(canvas);
      };

      reader.readAsDataURL(file);
    },
    [
      assignObjectToFrame,
      frameForObject,
      normalizeFrameStack,
      pushHistory,
      syncCanvasState,
    ]
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

    if ((fabric as any).FabricObject) {
      (fabric as any).FabricObject.customProperties = [
        ...BUILDER_CUSTOM_PROPERTIES,
      ];
    }

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
      const target = canvas.findTarget(event.e);

      if (isFrameObject(target)) {
        const frameId = ensureObjectId(target);
        if (frameId) {
          frameDragRef.current = {
            frameId,
            left: target.left ?? 0,
            top: target.top ?? 0,
          };
        }
      } else {
        frameDragRef.current = null;
      }

      if (currentTool === "select" || currentTool === "image" || currentTool === "hand") {
        return;
      }

      const pointer = canvas.getPointer(event.e);
      const parentFrame = frameContainingPoint(canvas, pointer);

      if (isFrameTool(currentTool)) {
        const preset = FRAME_PRESETS[currentTool];
        const frame = createFrameObject(currentTool, {
          x: pointer.x,
          y: pointer.y,
        });

        ensureObjectId(frame);
        const frameMeta = objectWithId(frame);
        if (frameMeta) {
          frameMeta.isFrame = true;
          frameMeta.framePreset = preset.preset;
          frameMeta.parentFrameId = null;
          frameMeta.objectName = `${preset.label} ${canvas
            .getObjects()
            .filter((item) => isFrameObject(item)).length + 1}`;
        }

        canvas.add(frame);
        canvas.setActiveObject(frame);
        canvas.requestRenderAll();
        syncCanvasState(canvas);
        pushHistory(canvas);
        dispatch(setSelectedTool("select"));
        return;
      }

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
        const textMeta = objectWithId(text);
        if (textMeta) {
          textMeta.objectName = "Text";
        }
        assignObjectToFrame(text, parentFrame);
        canvas.add(text);
        if (parentFrame) {
          normalizeFrameStack(canvas, parentFrame);
        }
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
        drawToolRef.current = "freeform";
        return;
      }

      const shape = createDrawableObject(currentTool, pointer);
      if (!shape) return;

      ensureObjectId(shape);
      const shapeMeta = objectWithId(shape);
      if (shapeMeta) {
        const defaultName =
          shape.type?.charAt(0).toUpperCase() + (shape.type?.slice(1) ?? "");
        shapeMeta.objectName = defaultName || "Shape";
      }
      assignObjectToFrame(shape, parentFrame);
      canvas.discardActiveObject();
      canvas.add(shape);
      if (parentFrame) {
        normalizeFrameStack(canvas, parentFrame);
      }
      canvas.setActiveObject(shape);
      shapeRef.current = objectWithId(shape);
      startPointRef.current = { x: pointer.x, y: pointer.y };
      drawToolRef.current = currentTool;
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
      } else if (
        drawToolRef.current === "star" ||
        drawToolRef.current === "arrow"
      ) {
        const width = Math.max(6, Math.abs(pointer.x - startX));
        const height = Math.max(6, Math.abs(pointer.y - startY));
        const baseWidth = currentShape.width ?? width;
        const baseHeight = currentShape.height ?? height;

        currentShape.set({
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y),
          scaleX: width / Math.max(1, baseWidth),
          scaleY: height / Math.max(1, baseHeight),
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
      queueSnapshotBroadcast(canvas);
    };

    const onMouseUp = () => {
      if (!isDrawingRef.current) {
        frameDragRef.current = null;
        drawToolRef.current = null;
        return;
      }

      isDrawingRef.current = false;
      frameDragRef.current = null;
      dispatch(setIsDrawing(false));
      const drawnTool = drawToolRef.current;
      drawToolRef.current = null;

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

      if (
        drawnTool === "rectangle" ||
        drawnTool === "circle" ||
        drawnTool === "triangle" ||
        drawnTool === "line" ||
        drawnTool === "diamond" ||
        drawnTool === "star" ||
        drawnTool === "arrow"
      ) {
        dispatch(setSelectedTool("select"));
      }
    };

    const onObjectAdded = (
      event: fabric.TEvent & { target?: fabric.Object }
    ) => {
      const target = event.target;
      if (!target) return;
      ensureObjectId(target);
      const meta = objectWithId(target);
      if (meta && !meta.objectName) {
        if (meta.isFrame) {
          const presetLabel =
            meta.framePreset === "mobile"
              ? "Mobile Frame"
              : meta.framePreset === "tablet"
                ? "Tablet Frame"
                : "Desktop Frame";
          meta.objectName = presetLabel;
        } else {
          const rawType = target.type ?? "layer";
          meta.objectName = rawType.charAt(0).toUpperCase() + rawType.slice(1);
        }
      }

      syncAllFrameRelations(canvas);
      syncCanvasState(canvas);
    };

    const onObjectRemoved = () => {
      syncAllFrameRelations(canvas);
      syncCanvasState(canvas);
      if (!restoringHistoryRef.current && !batchMutationRef.current) {
        pushHistory(canvas);
      }
    };

    const onObjectMoving = (
      event: fabric.TEvent & { target?: fabric.Object }
    ) => {
      const target = event.target;
      if (!target) return;
      if (!isFrameObject(target)) {
        queueSnapshotBroadcast(canvas);
        return;
      }

      const frameId = ensureObjectId(target);
      if (!frameId) return;

      const dragState = frameDragRef.current;
      if (!dragState || dragState.frameId !== frameId) {
        frameDragRef.current = {
          frameId,
          left: target.left ?? 0,
          top: target.top ?? 0,
        };
        syncFrameChildrenClipping(canvas, target);
        return;
      }

      const nextLeft = target.left ?? 0;
      const nextTop = target.top ?? 0;
      const deltaX = nextLeft - dragState.left;
      const deltaY = nextTop - dragState.top;

      if (deltaX !== 0 || deltaY !== 0) {
        getFrameChildren(canvas, frameId).forEach((child) => {
          child.set({
            left: (child.left ?? 0) + deltaX,
            top: (child.top ?? 0) + deltaY,
          });
          child.setCoords();
        });
      }

      frameDragRef.current = {
        frameId,
        left: nextLeft,
        top: nextTop,
      };
      syncFrameChildrenClipping(canvas, target);
      canvas.requestRenderAll();
      queueSnapshotBroadcast(canvas);
    };

    const onObjectModified = (
      event: fabric.TEvent & { target?: fabric.Object }
    ) => {
      const target = event.target;
      if (target && isFrameObject(target)) {
        syncFrameChildrenClipping(canvas, target);
      } else if (target && target.type !== "activeSelection") {
        const previousFrame = frameForObject(canvas, target);
        const center = target.getCenterPoint();
        const frame = frameContainingPoint(canvas, { x: center.x, y: center.y });
        assignObjectToFrame(target, frame);
        if (previousFrame) {
          normalizeFrameStack(canvas, previousFrame);
        }
        if (frame) {
          normalizeFrameStack(canvas, frame);
        }
      }

      syncAllFrameRelations(canvas);
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
      const pathMeta = objectWithId(event.path);
      if (pathMeta && !pathMeta.objectName) {
        pathMeta.objectName = "Free Draw";
      }

      const bounds = event.path.getBoundingRect();
      const frame = frameContainingPoint(canvas, {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
      assignObjectToFrame(event.path, frame);
      if (frame) {
        normalizeFrameStack(canvas, frame);
      }

      syncCanvasState(canvas);
      if (!restoringHistoryRef.current) {
        pushHistory(canvas);
      }

      if (selectedToolRef.current === "freeform") {
        dispatch(setSelectedTool("select"));
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
    canvas.on("object:moving", onObjectMoving as any);
    canvas.on("object:modified", onObjectModified as any);
    canvas.on("path:created", onPathCreated as any);

    const cleanupCanvasPan = setupCanvasPan(canvas, {
      isPanMode: () => selectedToolRef.current === "hand",
    });
    window.addEventListener("resize", resizeCanvas);

    historyRef.current = [snapshotCanvas(canvas)];
    historyIndexRef.current = 0;
    syncHistoryAvailability();
    syncAllFrameRelations(canvas);
    syncCanvasState(canvas);
    queueSnapshotBroadcast(canvas);

    if (!hasRequestedInitialSyncRef.current) {
      hasRequestedInitialSyncRef.current = true;
      broadcast({
        type: "builder:canvas-sync-request",
        sender: sessionIdRef.current,
      } satisfies CanvasSyncRequestEvent);
    }

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
      cleanupCanvasPan();
      if (pendingBroadcastFrameRef.current != null) {
        cancelAnimationFrame(pendingBroadcastFrameRef.current);
        pendingBroadcastFrameRef.current = null;
      }
      resetBuilderRuntime();
      canvas.dispose();
    };
  }, [
    addImageFromFile,
    assignObjectToFrame,
    bringToFront,
    clearCanvas,
    deleteSelected,
    dispatch,
    duplicateSelected,
    frameContainingPoint,
    frameForObject,
    getFrameChildren,
    normalizeFrameStack,
    pushHistory,
    queueSnapshotBroadcast,
    redo,
    selectObjectById,
    sendToBack,
    syncAllFrameRelations,
    syncCanvasState,
    syncFrameChildrenClipping,
    syncHistoryAvailability,
    undo,
    updateActiveObject,
    broadcast,
  ]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;

    const canvas = fabricRef.current;
    if (!canvas) return;

    const freeformMode = selectedTool === "freeform";
    const handMode = selectedTool === "hand";
    canvas.isDrawingMode = freeformMode;
    canvas.selection = selectedTool === "select";
    canvas.skipTargetFind = !(
      selectedTool === "select" || selectedTool === "freeform"
    );
    canvas.defaultCursor = handMode
      ? "grab"
      : selectedTool === "select"
        ? "default"
        : "crosshair";

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

      if (withMeta) {
        return;
      }

      if (key === "delete" || key === "backspace") {
        deleteSelected();
        return;
      }

      if (key === "v") {
        dispatch(setSelectedTool("select"));
      } else if (key === "h") {
        dispatch(setSelectedTool("hand"));
      } else if (key === "d") {
        dispatch(setSelectedTool("frameDesktop"));
      } else if (key === "b") {
        dispatch(setSelectedTool("frameTablet"));
      } else if (key === "m") {
        dispatch(setSelectedTool("frameMobile"));
      } else if (key === "r") {
        dispatch(setSelectedTool("rectangle"));
      } else if (key === "c") {
        dispatch(setSelectedTool("circle"));
      } else if (key === "t") {
        dispatch(setSelectedTool("triangle"));
      } else if (key === "l") {
        dispatch(setSelectedTool("line"));
      } else if (key === "o") {
        dispatch(setSelectedTool("diamond"));
      } else if (key === "s") {
        dispatch(setSelectedTool("star"));
      } else if (key === "a") {
        dispatch(setSelectedTool("arrow"));
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
