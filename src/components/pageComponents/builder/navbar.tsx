"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleHelp, LogOut } from "lucide-react";
import ThemeToggler from "../theme-toggle";
import ActiveUsers from "./users/activeUsers";
import { DropdownItem } from "./dropdown";
import { dropdownItems } from "@/constants/builder";
import Toolbar from "./toolbar";
import Button1 from "@/components/do-not-touch/buttons/button1";

export default function BuilderNavbar() {
  const [project] = useState("Website Builder");
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
              {dropdownItems.map((item, index) => (
                <div key={index}>
                  <DropdownItem
                    icon={item.icon}
                    label={item.label}
                    route={item.route}
                    onClick={item.onClick}
                  >
                    {item.children}
                  </DropdownItem>
                </div>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
              <DropdownItem icon={<LogOut size={14} />} label="Sign Out" />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <Toolbar />
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
        <Button1>Share</Button1>
        <Link
          href="/site/docs#shortcuts"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          title="Open keyboard shortcuts"
          aria-label="Open keyboard shortcuts"
        >
          <CircleHelp size={16} />
        </Link>
        <div>
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
