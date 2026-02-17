import * as fabric from "fabric";

type SetupCanvasPanOptions = {
  isPanMode?: () => boolean;
  minZoom?: number;
  maxZoom?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const normalizeWheelDelta = (value: number, deltaMode: number) => {
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return value * 16;
  }

  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return value * 96;
  }

  return value;
};

export function setupCanvasPan(
  canvas: fabric.Canvas,
  options?: SetupCanvasPanOptions
) {
  const minZoom = options?.minZoom ?? 0.2;
  const maxZoom = options?.maxZoom ?? 6;

  let isDragPanning = false;
  let lastX = 0;
  let lastY = 0;

  let targetPanX = canvas.viewportTransform?.[4] ?? 0;
  let targetPanY = canvas.viewportTransform?.[5] ?? 0;
  let panFrame: number | null = null;

  const ensureViewport = () => {
    if (!canvas.viewportTransform) {
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    }

    return canvas.viewportTransform;
  };

  const runPanAnimation = () => {
    panFrame = null;

    const viewport = ensureViewport();
    const deltaX = targetPanX - viewport[4];
    const deltaY = targetPanY - viewport[5];

    const doneX = Math.abs(deltaX) < 0.1;
    const doneY = Math.abs(deltaY) < 0.1;

    viewport[4] = doneX ? targetPanX : viewport[4] + deltaX * 0.28;
    viewport[5] = doneY ? targetPanY : viewport[5] + deltaY * 0.28;

    canvas.setViewportTransform(viewport);
    canvas.requestRenderAll();

    if (!doneX || !doneY) {
      panFrame = requestAnimationFrame(runPanAnimation);
    }
  };

  const queuePanDelta = (deltaX: number, deltaY: number) => {
    targetPanX += deltaX;
    targetPanY += deltaY;

    if (panFrame === null) {
      panFrame = requestAnimationFrame(runPanAnimation);
    }
  };

  const getWheelPoint = (evt: WheelEvent) => {
    const rect = canvas.upperCanvasEl?.getBoundingClientRect();
    if (!rect) {
      return new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
    }

    return new fabric.Point(evt.clientX - rect.left, evt.clientY - rect.top);
  };

  const zoomBy = (point: fabric.Point, factor: number) => {
    const currentZoom = canvas.getZoom();
    const nextZoom = clamp(currentZoom * factor, minZoom, maxZoom);

    if (Math.abs(nextZoom - currentZoom) < 0.0001) return;

    canvas.zoomToPoint(point, nextZoom);

    const viewport = ensureViewport();
    targetPanX = viewport[4];
    targetPanY = viewport[5];

    canvas.requestRenderAll();
  };

  const onWheel = (opt: fabric.TEvent) => {
    const evt = opt.e as WheelEvent;
    const deltaX = normalizeWheelDelta(evt.deltaX, evt.deltaMode);
    const deltaY = normalizeWheelDelta(evt.deltaY, evt.deltaMode);

    const isZoomIntent =
      evt.ctrlKey || evt.metaKey || evt.deltaMode === WheelEvent.DOM_DELTA_LINE;

    if (isZoomIntent) {
      const zoomPoint =
        evt.ctrlKey || evt.metaKey
          ? getWheelPoint(evt)
          : new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
      const zoomFactor = Math.exp(-deltaY * 0.0018);
      zoomBy(zoomPoint, zoomFactor);
    } else {
      queuePanDelta(-deltaX, -deltaY);
    }

    evt.preventDefault();
    evt.stopPropagation();
  };

  const shouldDragPan = (evt: MouseEvent) =>
    evt.altKey || options?.isPanMode?.() === true;

  const onMouseDown = (opt: fabric.TEvent) => {
    const evt = opt.e as MouseEvent;
    if (!shouldDragPan(evt)) return;

    isDragPanning = true;
    lastX = evt.clientX;
    lastY = evt.clientY;
    canvas.defaultCursor = "grabbing";
    canvas.requestRenderAll();
  };

  const onMouseMove = (opt: fabric.TEvent) => {
    if (!isDragPanning) return;

    const evt = opt.e as MouseEvent;
    const deltaX = evt.clientX - lastX;
    const deltaY = evt.clientY - lastY;
    lastX = evt.clientX;
    lastY = evt.clientY;

    queuePanDelta(deltaX, deltaY);
  };

  const onMouseUp = () => {
    if (!isDragPanning) return;
    isDragPanning = false;
    canvas.defaultCursor = options?.isPanMode?.() ? "grab" : "default";
    canvas.requestRenderAll();
  };

  canvas.on("mouse:wheel", onWheel);
  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return () => {
    canvas.off("mouse:wheel", onWheel);
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);

    if (panFrame !== null) {
      cancelAnimationFrame(panFrame);
      panFrame = null;
    }
  };
}
