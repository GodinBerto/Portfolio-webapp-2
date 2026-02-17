"use client";

import {
  BringToFront,
  ChevronDown,
  Copy,
  Hand,
  MousePointer2,
  Pencil,
  Redo2,
  RotateCcw,
  SendToBack,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import ShapesTool from "./tools/shapes";
import FramesTool from "./tools/frames";
import { ToolbarButtonProps } from "@/types/builder";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedTool } from "@/store/slice/builder/canvasSlice";
import { getBuilderRuntime } from "@/lib/builder/runtime";

export default function Toolbar() {
  const dispatch = useDispatch();
  const runtime = getBuilderRuntime();
  const { selectedTool, canUndo, canRedo, activeObject } = useSelector(
    (state: RootState) => state.canvas
  );

  return (
    <div className="flex items-center gap-1 pl-3">
      <ToolbarButton
        icon={<MousePointer2 size={16} />}
        onClick={() => dispatch(setSelectedTool("select"))}
        active={selectedTool === "select"}
      />
      <ToolbarButton
        icon={<Hand size={16} />}
        onClick={() => dispatch(setSelectedTool("hand"))}
        active={selectedTool === "hand"}
      />
      <ToolbarButton
        icon={<Type size={16} />}
        onClick={() => dispatch(setSelectedTool("text"))}
        active={selectedTool === "text"}
      />
      <ShapesTool />
      <FramesTool />
      <ToolbarButton
        icon={<Pencil size={16} />}
        onClick={() => dispatch(setSelectedTool("freeform"))}
        active={selectedTool === "freeform"}
      />
      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-700" />
      <ToolbarButton
        icon={<Undo2 size={16} />}
        onClick={runtime.undo}
        disabled={!canUndo}
      />
      <ToolbarButton
        icon={<Redo2 size={16} />}
        onClick={runtime.redo}
        disabled={!canRedo}
      />
      <ToolbarButton
        icon={<BringToFront size={16} />}
        onClick={runtime.bringToFront}
        disabled={!activeObject}
      />
      <ToolbarButton
        icon={<SendToBack size={16} />}
        onClick={runtime.sendToBack}
        disabled={!activeObject}
      />
      <ToolbarButton
        icon={<Copy size={16} />}
        onClick={() => void runtime.duplicateSelected()}
        disabled={!activeObject}
      />
      <ToolbarButton
        icon={<Trash2 size={16} />}
        onClick={runtime.deleteSelected}
        disabled={!activeObject}
      />
      <ToolbarButton icon={<RotateCcw size={16} />} onClick={runtime.clearCanvas} />
    </div>
  );
}

export function ToolbarButton({
  icon,
  onClick,
  children,
  active,
  disabled,
}: ToolbarButtonProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <div className="relative flex items-stretch">
      <button
        type="button"
        className={`rounded-md p-1.5 transition ${
          active
            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>

      {hasChildren && (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md px-1 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <ChevronDown size={14} />
        </button>
      )}

      {open && hasChildren && (
        <div
          className="absolute left-0 top-full z-50 mt-1 flex w-64 flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-semiblack"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ToolbarItem({
  icon,
  label,
  shortcut,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      <span className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </span>
      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-300">
        {shortcut}
      </span>
    </button>
  );
}
