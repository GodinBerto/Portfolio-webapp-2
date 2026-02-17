"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleHelp, LogOut } from "lucide-react";
import ThemeToggler from "../theme-toggle";
import ActiveUsers from "./users/activeUsers";
import { DropdownItem } from "./dropdown";
import { dropdownItems } from "@/constants/builder";
import Button1 from "@/components/do-not-touch/buttons/button1";
import { useSearchParams } from "next/navigation";

export default function BuilderNavbar() {
  const [project] = useState("Website Builder");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const homeItem = useMemo(
    () => dropdownItems.find((item) => item.label === "Go to home"),
    []
  );
  const workspaceMenus = useMemo(
    () =>
      dropdownItems.filter(
        (item) => item.label !== "Go to home" && item.children?.length
      ),
    []
  );

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const text = roomId
      ? [
          `Room ID: ${roomId}`,
          `Join Link: ${window.location.href}`,
        ]
          .filter(Boolean)
          .join("\n")
      : window.location.href;

    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
    } catch {
      setShareCopied(false);
    }
  };

  useEffect(() => {
    if (!shareCopied) return;
    const timeout = window.setTimeout(() => setShareCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [shareCopied]);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 bg-white dark:bg-semiblack shadow-sm relative h-[60px] z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-1">
            <Image
              src="/images/cards/profile.jpg"
              alt="Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-semibold text-sm">BertoStudio</span>
          </Link>
          {homeItem?.route && (
            <Link
              href={homeItem.route}
              className="rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Home
            </Link>
          )}
        </div>

        <nav className="flex items-center gap-2">
          {workspaceMenus.map((menu) => {
            const isOpen = openMenu === menu.label;

            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.label)}
                onMouseLeave={() =>
                  setOpenMenu((current) =>
                    current === menu.label ? null : current
                  )
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === menu.label ? null : menu.label
                    )
                  }
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm transition ${
                    isOpen
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {menu.label}
                  <ChevronDown size={14} />
                </button>

                {isOpen && menu.children && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-semiblack">
                    {menu.children.map((item, index) => (
                      <DropdownItem key={`${menu.label}-${index}`} {...item} />
                    ))}
                    {menu.label === "Settings" && (
                      <>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                        <DropdownItem icon={<LogOut size={14} />} label="Sign Out" />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-1 cursor-pointer">
        <span className="font-medium text-sm">{project}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex -space-x-2">
          <ActiveUsers />
        </div>
        <Button1 onClick={handleShare}>
          {shareCopied ? "Copied" : roomId ? "Invite" : "Share"}
        </Button1>
        <Link
          href="/site/docs/shortcuts"
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
