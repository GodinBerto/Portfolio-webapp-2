import { ActiveElement } from "@/types/builder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NavbarState = {
  activeElement: ActiveElement;
  imageInputRef: File | null;
};

const initialState: NavbarState = {
  activeElement: null,
  imageInputRef: null,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    handleActiveElement: (state, action: PayloadAction<ActiveElement>) => {
      state.activeElement = action.payload;
    },
    handleImageUpload: (state, action: PayloadAction<File | null>) => {
      state.imageInputRef = action.payload;
    },
    resetNavbarState: () => initialState,
  },
});

export const { handleActiveElement, handleImageUpload, resetNavbarState } =
  navbarSlice.actions;
export default navbarSlice.reducer;
