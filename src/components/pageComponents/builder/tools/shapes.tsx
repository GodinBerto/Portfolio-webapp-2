import { Circle, Square, Triangle } from "lucide-react";
import Toolbar, { ToolbarButton, ToolbarItem } from "../toolbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedShape } from "@/store/slice/builder/canvasSlice";

const shapeIcons: Record<string, JSX.Element> = {
  rectangle: <Square size={18} />,
  circle: <Circle size={18} />,
  triangle: <Triangle size={18} />,
};

export default function ShapesTool() {
  const dispatch = useDispatch();
  const selectedShapeRef = useSelector(
    (state: RootState) => state.canvas.selectedShapeRef
  );

  return (
    <div>
      <ToolbarButton
        icon={shapeIcons[selectedShapeRef || "rectangle"]}
        onClick={() => {}}
      >
        <ToolbarItem
          icon={<Square size={18} />}
          label="Rectangle"
          shortcut="R"
          onClick={() => dispatch(setSelectedShape("rectangle"))}
        />
        <ToolbarItem
          icon={<Circle size={18} />}
          label="Circle"
          shortcut="C"
          onClick={() => dispatch(setSelectedShape("circle"))}
        />
        <ToolbarItem
          icon={<Triangle size={18} />}
          label="Triangle"
          shortcut="T"
          onClick={() => dispatch(setSelectedShape("triangle"))}
        />
      </ToolbarButton>
    </div>
  );
}
