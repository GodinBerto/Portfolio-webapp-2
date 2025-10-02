// store/canvasSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CanvasState {
  isDrawing: boolean;
  selectedShapeRef: string | null;
}

const initialState: CanvasState = {
  isDrawing: false,
  selectedShapeRef: "triangle",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setIsDrawing(state, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload;
    },
    setSelectedShape(state, action: PayloadAction<string | null>) {
      state.selectedShapeRef = action.payload;
    },
  },
});

export const { setIsDrawing, setSelectedShape } = canvasSlice.actions;
export default canvasSlice.reducer;
