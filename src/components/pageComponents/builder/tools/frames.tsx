"use client";

import { Laptop, Smartphone, Tablet } from "lucide-react";
import { ToolbarButton, ToolbarItem } from "../toolbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FrameTool, setSelectedTool } from "@/store/slice/builder/canvasSlice";

const frameIcons: Record<FrameTool, JSX.Element> = {
  frameDesktop: <Laptop size={16} />,
  frameTablet: <Tablet size={16} />,
  frameMobile: <Smartphone size={16} />,
};

export default function FramesTool() {
  const dispatch = useDispatch();
  const selectedTool = useSelector((state: RootState) => state.canvas.selectedTool);

  const activeFrameTool = (
    ["frameDesktop", "frameTablet", "frameMobile"] as FrameTool[]
  ).includes(selectedTool as FrameTool)
    ? (selectedTool as FrameTool)
    : "frameDesktop";

  return (
    <ToolbarButton
      icon={frameIcons[activeFrameTool]}
      onClick={() => dispatch(setSelectedTool(activeFrameTool))}
      active={activeFrameTool === selectedTool}
    >
      <ToolbarItem
        icon={<Laptop size={16} />}
        label="Desktop Frame"
        shortcut="D"
        onClick={() => dispatch(setSelectedTool("frameDesktop"))}
      />
      <ToolbarItem
        icon={<Tablet size={16} />}
        label="Tablet Frame"
        shortcut="B"
        onClick={() => dispatch(setSelectedTool("frameTablet"))}
      />
      <ToolbarItem
        icon={<Smartphone size={16} />}
        label="Mobile Frame"
        shortcut="M"
        onClick={() => dispatch(setSelectedTool("frameMobile"))}
      />
    </ToolbarButton>
  );
}
