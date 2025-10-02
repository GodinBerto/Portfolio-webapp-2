import {
  MousePointer2,
  Type,
  Square,
  MessageCircle,
  Pencil,
  ChevronDown,
} from "lucide-react";
import ShapesTool from "./tools/shapes";
import { ToolbarButtonProps } from "@/types/builder";
import { useState } from "react";
import { useTheme } from "@/context/themeContext";
import { themeClasses } from "@/constants/themes";
import React from "react";

export default function Toolbar() {
  return (
    <div className="flex items-center space-x-1 pl-3">
      <ToolbarButton icon={<MousePointer2 size={18} />} />
      <ToolbarButton icon={<Type size={18} />} />
      <ShapesTool />
      <ToolbarButton icon={<MessageCircle size={18} />} />
      <ToolbarButton icon={<Pencil size={18} />} />
    </div>
  );
}

export function ToolbarButton({ icon, onClick, children }: ToolbarButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex">
      {/* Main icon button */}
      <button
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-gray-600"
        onClick={onClick}
      >
        {icon}
      </button>

      {/* Dropdown toggle (optional separate button, can be removed if not needed) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
      >
        <ChevronDown size={16} className="text-gray-500 w-3 h-full" />
      </button>

      {/* Dropdown menu */}
      {open && children && (
        <div className="absolute top-full mt-1 p-2 flex flex-col gap-2 left-0 w-[250px] bg-white dark:bg-semiblack border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {/* Clone children so they can close dropdown on click */}
          {Array.isArray(children)
            ? children.map((child, i) =>
                React.cloneElement(child as React.ReactElement, {
                  key: i,
                  onClick: (e: any) => {
                    if ((child as any).props.onClick) {
                      (child as any).props.onClick(e);
                    }
                    setOpen(false); // close dropdown
                  },
                })
              )
            : React.cloneElement(children as React.ReactElement, {
                onClick: (e: any) => {
                  if ((children as any).props.onClick) {
                    (children as any).props.onClick(e);
                  }
                  setOpen(false);
                },
              })}
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
  onClick?: () => void;
}) {
  const { theme } = useTheme();

  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1 flex gap-6 cursor-pointer h-full w-full justify-between items-center rounded-md transition
        ${currentThemeClass} text-gray-600 hover:bg-gray-700 hover:text-white`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-sm">{label}</h1>
      </div>
      <h1 className="text-sm font-semibold w-6 rounded-md flex justify-center items-center">
        {shortcut}
      </h1>
    </button>
  );
}
