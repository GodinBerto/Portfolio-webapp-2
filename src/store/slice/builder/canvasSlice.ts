import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BuilderShapeTool =
  | "rectangle"
  | "circle"
  | "triangle"
  | "line"
  | "diamond"
  | "star"
  | "arrow"
  | "freeform"
  | "image";

export type FramePreset = "desktop" | "tablet" | "mobile";

export type FrameTool = "frameDesktop" | "frameTablet" | "frameMobile";

export type BuilderTool = BuilderShapeTool | FrameTool | "select" | "text" | "hand";

export type CanvasLayer = {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  parentId?: string | null;
  isFrame?: boolean;
  framePreset?: FramePreset;
};

export type ActiveCanvasObject = {
  id: string;
  name: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  parentId?: string | null;
  isFrame?: boolean;
  framePreset?: FramePreset;
};

interface CanvasState {
  isDrawing: boolean;
  selectedShapeRef: BuilderShapeTool;
  selectedTool: BuilderTool;
  layers: CanvasLayer[];
  activeObject: ActiveCanvasObject | null;
  canUndo: boolean;
  canRedo: boolean;
}

const shapeTools: BuilderShapeTool[] = [
  "rectangle",
  "circle",
  "triangle",
  "line",
  "diamond",
  "star",
  "arrow",
  "freeform",
  "image",
];

const initialState: CanvasState = {
  isDrawing: false,
  selectedShapeRef: "rectangle",
  selectedTool: "select",
  layers: [],
  activeObject: null,
  canUndo: false,
  canRedo: false,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setIsDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload;
    },
    setSelectedShape(state, action: PayloadAction<BuilderShapeTool>) {
      state.selectedShapeRef = action.payload;
      state.selectedTool = action.payload;
    },
    setSelectedTool(state, action: PayloadAction<BuilderTool>) {
      state.selectedTool = action.payload;
      if (shapeTools.includes(action.payload as BuilderShapeTool)) {
        state.selectedShapeRef = action.payload as BuilderShapeTool;
      }
    },
    setLayers(state, action: PayloadAction<CanvasLayer[]>) {
      state.layers = action.payload;
    },
    setActiveObject(state, action: PayloadAction<ActiveCanvasObject | null>) {
      state.activeObject = action.payload;
    },
    clearActiveObject(state) {
      state.activeObject = null;
    },
    setHistoryState(
      state,
      action: PayloadAction<{ canUndo: boolean; canRedo: boolean }>
    ) {
      state.canUndo = action.payload.canUndo;
      state.canRedo = action.payload.canRedo;
    },
  },
});

export const {
  setIsDrawing,
  setSelectedShape,
  setSelectedTool,
  setLayers,
  setActiveObject,
  clearActiveObject,
  setHistoryState,
} = canvasSlice.actions;

export default canvasSlice.reducer;
