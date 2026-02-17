"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronRight,
  Frame,
  Layers,
  Minus,
  PlusCircle,
  Sidebar,
  Trash2,
  Type,
} from "lucide-react";
import { RootState } from "@/store/store";
import { setSidebar } from "@/store/slice/sidebarSlice";
import { CanvasLayer } from "@/store/slice/builder/canvasSlice";
import { getBuilderRuntime } from "@/lib/builder/runtime";

type LayerNode = CanvasLayer & {
  children: LayerNode[];
};

const layerIcon = (layer: CanvasLayer) => {
  if (layer.isFrame) {
    return <Frame size={14} className="text-indigo-500" />;
  }

  if (layer.type === "i-text") {
    return <Type size={14} className="text-blue-500" />;
  }

  if (layer.type === "line" || layer.type === "path") {
    return <Minus size={14} className="text-emerald-500" />;
  }

  return <Layers size={14} className="text-gray-500" />;
};

const buildLayerTree = (layers: CanvasLayer[]) => {
  const nodeMap = new Map<string, LayerNode>();
  const roots: LayerNode[] = [];

  layers.forEach((layer) => {
    nodeMap.set(layer.id, {
      ...layer,
      children: [],
    });
  });

  layers.forEach((layer) => {
    const node = nodeMap.get(layer.id);
    if (!node) return;

    if (layer.parentId && nodeMap.has(layer.parentId)) {
      nodeMap.get(layer.parentId)!.children.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
};

export default function BuilderLeftSidebar() {
  const dispatch = useDispatch();
  const runtime = getBuilderRuntime();
  const [expandedFrames, setExpandedFrames] = useState<Record<string, boolean>>(
    {}
  );

  const showSidebar = useSelector(
    (state: RootState) => state.sidebar.showSidebar
  );
  const layers = useSelector((state: RootState) => state.canvas.layers);
  const activeObject = useSelector((state: RootState) => state.canvas.activeObject);

  const layerTree = useMemo(() => buildLayerTree(layers), [layers]);

  const toggleExpanded = (layerId: string) => {
    setExpandedFrames((prev) => ({
      ...prev,
      [layerId]: !(prev[layerId] ?? true),
    }));
  };

  return (
    <aside className="flex h-full overflow-y-auto">
      <div className="flex w-[50px] flex-col items-center border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-semiblack">
        <PlusCircle
          size={28}
          className="m-2 cursor-pointer p-1 text-gray-500 transition hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => dispatch(setSidebar(true))}
        />
        <Layers
          size={28}
          className="m-2 cursor-pointer rounded-md bg-gray-300 p-1 text-gray-700 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
          onClick={() => dispatch(setSidebar(!showSidebar))}
        />
      </div>

      {showSidebar && (
        <div className="w-[250px] overflow-hidden border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-semiblack">
          <div className="flex items-center justify-between gap-2 p-3">
            <h1 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Layers
            </h1>
            <Sidebar
              size={18}
              className="cursor-pointer text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => dispatch(setSidebar(false))}
            />
          </div>

          <div className="px-2 pb-2">
            {layers.length === 0 && (
              <p className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No elements yet. Add a frame, then design inside it.
              </p>
            )}

            {layerTree.map((layer) => (
              <LayerRow
                key={layer.id}
                layer={layer}
                depth={0}
                activeObjectId={activeObject?.id ?? null}
                expandedFrames={expandedFrames}
                onToggleExpanded={toggleExpanded}
                onSelect={runtime.selectObjectById}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 px-2 py-2 dark:border-gray-700">
            <button
              type="button"
              onClick={runtime.deleteSelected}
              disabled={!activeObject}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function LayerRow({
  layer,
  depth,
  activeObjectId,
  expandedFrames,
  onToggleExpanded,
  onSelect,
}: {
  layer: LayerNode;
  depth: number;
  activeObjectId: string | null;
  expandedFrames: Record<string, boolean>;
  onToggleExpanded: (layerId: string) => void;
  onSelect: (layerId: string) => void;
}) {
  const isActive = activeObjectId === layer.id;
  const isExpanded = expandedFrames[layer.id] ?? true;
  const hasChildren = layer.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(layer.id)}
        className={`mb-1 flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition ${
          isActive
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {hasChildren ? (
          <span
            className="cursor-pointer p-0.5 text-gray-500"
            onClick={(event) => {
              event.stopPropagation();
              onToggleExpanded(layer.id);
            }}
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        ) : (
          <span className="w-[13px]" />
        )}

        <span className="shrink-0">{layerIcon(layer)}</span>
        <span className="min-w-0 flex-1 truncate">{layer.name}</span>
      </button>

      {hasChildren && isExpanded &&
        layer.children.map((child) => (
          <LayerRow
            key={child.id}
            layer={child}
            depth={depth + 1}
            activeObjectId={activeObjectId}
            expandedFrames={expandedFrames}
            onToggleExpanded={onToggleExpanded}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
