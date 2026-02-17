import { ActiveCanvasObject } from "@/store/slice/builder/canvasSlice";

type BuilderRuntime = {
  deleteSelected: () => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  duplicateSelected: () => void;
  selectObjectById: (objectId: string) => void;
  updateActiveObject: (updates: Partial<ActiveCanvasObject>) => void;
  bringToFront: () => void;
  sendToBack: () => void;
  addImageFromFile: (file: File) => void;
};

const noop = () => {};

const defaultRuntime: BuilderRuntime = {
  deleteSelected: noop,
  clearCanvas: noop,
  undo: noop,
  redo: noop,
  duplicateSelected: noop,
  selectObjectById: noop,
  updateActiveObject: noop,
  bringToFront: noop,
  sendToBack: noop,
  addImageFromFile: noop,
};

let runtime: BuilderRuntime = { ...defaultRuntime };

export const setBuilderRuntime = (nextRuntime: Partial<BuilderRuntime>) => {
  runtime = { ...runtime, ...nextRuntime };
};

export const resetBuilderRuntime = () => {
  runtime = { ...defaultRuntime };
};

export const getBuilderRuntime = (): BuilderRuntime => runtime;
