import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slice/sidebarSlice";
import canvasReducer from "./slice/builder/canvasSlice";
import navbarReducer from "./slice/builder/navbarSlice";

export const store = () => {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      canvas: canvasReducer,
      builderNavbar: navbarReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
