"use client";

import { useDispatch, useSelector } from "react-redux";
import { Layers, Sidebar, PlusCircle, Trash2 } from "lucide-react";
import { RootState } from "@/store/store";
import { setSidebar } from "@/store/slice/sidebarSlice";
import { getBuilderRuntime } from "@/lib/builder/runtime";

export default function BuilderLeftSidebar() {
  const dispatch = useDispatch();
  const runtime = getBuilderRuntime();

  const showSidebar = useSelector(
    (state: RootState) => state.sidebar.showSidebar
  );
  const layers = useSelector((state: RootState) => state.canvas.layers);
  const activeObject = useSelector((state: RootState) => state.canvas.activeObject);

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
                No elements yet. Choose a shape tool and draw on the canvas.
              </p>
            )}

            {layers.map((layer) => {
              const isActive = activeObject?.id === layer.id;

              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => runtime.selectObjectById(layer.id)}
                  className={`mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition ${
                    isActive
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="truncate">{layer.name}</span>
                  <span className="text-xs uppercase opacity-70">{layer.type}</span>
                </button>
              );
            })}
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
