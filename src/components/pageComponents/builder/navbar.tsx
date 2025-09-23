"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  Plus,
  Type,
  Square,
  Zap,
  Undo,
  Redo,
  LogOut,
  Home,
  Save,
  RefreshCcw,
} from "lucide-react";
import ThemeToggler from "../theme-toggle";
import Link from "next/link";
import ActiveUsers from "./users/activeUsers";

export default function BuilderNavbar() {
  const [project, setProject] = useState("Website Builder");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 bg-white dark:bg-semiblack shadow-sm relative h-[60px] z-30">
      {/* Left Side */}
      <div className="flex items-center space-x-3">
        {/* Logo & Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image
              src="/images/cards/profile.jpg"
              alt="Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-semibold text-sm">BertoStudio</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute mt-2 w-44 bg-white dark:bg-semiblack border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg z-50">
              <DropdownItem
                icon={<Home size={14} />}
                label="Go Home"
                route="/"
              />
              <DropdownItem icon={<Save size={14} />} label="Save" />
              <DropdownItem icon={<RefreshCcw size={14} />} label="Convert" />
              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
              <DropdownItem icon={<LogOut size={14} />} label="Sign Out" />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-1 ml-3">
          <ToolbarButton icon={<Plus size={16} />} />
          <ToolbarButton icon={<Type size={16} />} />
          <ToolbarButton icon={<Square size={16} />} />
          <ToolbarButton icon={<Zap size={16} />} />
          <div className="border-l h-4 mx-2" />
          <ToolbarButton icon={<Undo size={16} />} />
          <ToolbarButton icon={<Redo size={16} />} />
        </div>
      </div>

      {/* Middle */}
      <div className="flex items-center space-x-1 cursor-pointer">
        <span className="font-medium text-sm">{project}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3">
        {/* Collaborators */}
        <div className="flex -space-x-2">
          <ActiveUsers />
        </div>

        {/* Share Button */}
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-md">
          Share
        </button>
        <div>
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

/* ---------- Small Reusable Components ---------- */

function ToolbarButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
      {icon}
    </button>
  );
}

function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-7 h-7 rounded-full border border-white overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={28}
        height={28}
        className="object-cover"
      />
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  route,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  route?: string;
}) {
  return (
    <Link href={route || "#"}>
      <div
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition"
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}
