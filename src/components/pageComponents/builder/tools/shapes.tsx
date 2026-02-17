"use client";

import { Circle, ImagePlus, Minus, Square, Triangle } from "lucide-react";
import { ToolbarButton, ToolbarItem } from "../toolbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  BuilderShapeTool,
  setSelectedShape,
  setSelectedTool,
} from "@/store/slice/builder/canvasSlice";
import { useRef } from "react";
import { getBuilderRuntime } from "@/lib/builder/runtime";

const shapeIcons: Record<BuilderShapeTool, JSX.Element> = {
  rectangle: <Square size={16} />,
  circle: <Circle size={16} />,
  triangle: <Triangle size={16} />,
  line: <Minus size={16} />,
  freeform: <Minus size={16} />,
  image: <ImagePlus size={16} />,
};

export default function ShapesTool() {
  const dispatch = useDispatch();
  const runtime = getBuilderRuntime();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedShapeRef = useSelector(
    (state: RootState) => state.canvas.selectedShapeRef
  );
  const selectedTool = useSelector((state: RootState) => state.canvas.selectedTool);

  const isShapeToolActive = ["rectangle", "circle", "triangle", "line"].includes(
    selectedTool
  );

  return (
    <>
      <ToolbarButton
        icon={shapeIcons[selectedShapeRef] ?? <Square size={16} />}
        onClick={() => dispatch(setSelectedShape(selectedShapeRef))}
        active={isShapeToolActive}
      >
        <ToolbarItem
          icon={<Square size={16} />}
          label="Rectangle"
          shortcut="R"
          onClick={() => dispatch(setSelectedShape("rectangle"))}
        />
        <ToolbarItem
          icon={<Circle size={16} />}
          label="Circle"
          shortcut="C"
          onClick={() => dispatch(setSelectedShape("circle"))}
        />
        <ToolbarItem
          icon={<Triangle size={16} />}
          label="Triangle"
          shortcut="T"
          onClick={() => dispatch(setSelectedShape("triangle"))}
        />
        <ToolbarItem
          icon={<Minus size={16} />}
          label="Line"
          shortcut="L"
          onClick={() => dispatch(setSelectedShape("line"))}
        />
        <ToolbarItem
          icon={<ImagePlus size={16} />}
          label="Image"
          shortcut="I"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        />
      </ToolbarButton>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          runtime.addImageFromFile(file);
          dispatch(setSelectedTool("select"));
          event.currentTarget.value = "";
        }}
      />
    </>
  );
}
