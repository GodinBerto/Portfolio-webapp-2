import * as fabric from "fabric";

let isPanning = false;
let targetX = 0;
let targetY = 0;
let currentCanvas: fabric.Canvas | null = null;

// For Alt+Mouse drag panning
let isAltDragging = false;
let lastX = 0;
let lastY = 0;

/**
 * Animate the viewport towards targetX/Y for smooth panning
 */
function animatePan() {
  if (!currentCanvas || !isPanning) return;
  const vpt = currentCanvas.viewportTransform;
  if (!vpt) return;

  // Smooth interpolation (lerp)
  vpt[4] += (targetX - vpt[4]) * 0.15;
  vpt[5] += (targetY - vpt[5]) * 0.15;

  currentCanvas.setViewportTransform(vpt);
  currentCanvas.requestRenderAll();

  requestAnimationFrame(animatePan);
}

/**
 * Zoom to cursor (trackpad pinch / ctrl+scroll)
 */
function zoomToCursor(canvas: fabric.Canvas, evt: WheelEvent) {
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** evt.deltaY;
  zoom = Math.max(0.2, Math.min(zoom, 4));

  const pointer = canvas.getPointer(evt);
  const zoomPoint = new fabric.Point(pointer.x, pointer.y);

  canvas.zoomToPoint(zoomPoint, zoom);
}

/**
 * Zoom to canvas center (mouse scroll wheel)
 */
function zoomToCenter(canvas: fabric.Canvas, evt: WheelEvent) {
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** evt.deltaY;
  zoom = Math.max(0.2, Math.min(zoom, 4));

  const center = new fabric.Point(
    canvas.getWidth() / 2,
    canvas.getHeight() / 2
  );
  canvas.zoomToPoint(center, zoom);
}

/**
 * Handle mouse wheel events
 */
export function handleMouseWheel(canvas: fabric.Canvas, opt: fabric.TEvent) {
  const evt = opt.e as WheelEvent;
  const vpt = canvas.viewportTransform;
  if (!vpt) return;

  if (evt.ctrlKey) {
    // ✅ Pinch or ctrl+scroll → zoom to cursor
    zoomToCursor(canvas, evt);
  } else if (evt.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    // ✅ Mouse scroll wheel → zoom to center
    zoomToCenter(canvas, evt);
  } else {
    // ✅ Trackpad two-finger scroll → pan
    if (!isPanning) {
      isPanning = true;
      targetX = vpt[4];
      targetY = vpt[5];
      currentCanvas = canvas;
      animatePan();
    }

    targetX -= evt.deltaX;
    targetY -= evt.deltaY;
  }

  evt.preventDefault();
  evt.stopPropagation();
}

/**
 * Handle Alt + Mouse drag pan
 */
export function handleAltMouseDown(canvas: fabric.Canvas, opt: fabric.TEvent) {
  const evt = opt.e as MouseEvent;
  if (evt.altKey) {
    isAltDragging = true;
    lastX = evt.clientX;
    lastY = evt.clientY;
    currentCanvas = canvas;
  }
}

export function handleAltMouseMove(canvas: fabric.Canvas, opt: fabric.TEvent) {
  if (!isAltDragging) return;

  const evt = opt.e as MouseEvent;
  const vpt = canvas.viewportTransform;
  if (!vpt) return;

  const dx = evt.clientX - lastX;
  const dy = evt.clientY - lastY;

  vpt[4] += dx;
  vpt[5] += dy;

  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();

  lastX = evt.clientX;
  lastY = evt.clientY;
}

export function handleAltMouseUp() {
  isAltDragging = false;
}

/**
 * Stop trackpad panning
 */
export function stopPan() {
  isPanning = false;
}

/**
 * Setup all pan + zoom event bindings
 */
export function setupCanvasPan(canvas: fabric.Canvas) {
  currentCanvas = canvas;

  // ✅ Trackpad pan + zoom, mouse wheel zoom
  canvas.on("mouse:wheel", (opt) => handleMouseWheel(canvas, opt));

  // ✅ Alt + drag pan
  canvas.on("mouse:down", (opt) => handleAltMouseDown(canvas, opt));
  canvas.on("mouse:move", (opt) => handleAltMouseMove(canvas, opt));
  canvas.on("mouse:up", () => {
    stopPan();
    handleAltMouseUp();
  });
}
