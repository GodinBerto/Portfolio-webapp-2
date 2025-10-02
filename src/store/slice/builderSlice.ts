import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  showSidebar: boolean;
}

const initialState: SidebarState = {
  showSidebar: true, // same as your useState(true)
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setSidebar: (state, action: { payload: boolean }) => {
      state.showSidebar = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
