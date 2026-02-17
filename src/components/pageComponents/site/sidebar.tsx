"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { themeClasses } from "@/constants/themes";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DocsData } from "@/app/site/docs/data";

type SidebarProps = {
  currentSlug?: string;
};

export default function Sidebar({ currentSlug }: SidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const currentThemeClass = themeClasses[theme] || "green";

  const activeSlug = useMemo(() => {
    if (currentSlug) return currentSlug;
    const chunks = pathname.split("/").filter(Boolean);
    return chunks[chunks.length - 1] ?? "introduction";
  }, [currentSlug, pathname]);

  const defaultOpenSection = useMemo(() => {
    const section = DocsData.find((item) =>
      item.dropdowns.some((dropdown) => dropdown.slug === activeSlug)
    );

    return section?.name ?? DocsData[0]?.name ?? null;
  }, [activeSlug]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(
    defaultOpenSection
  );

  useEffect(() => {
    setOpenDropdown(defaultOpenSection);
  }, [defaultOpenSection]);

  const toggleDropdown = (sectionName: string) => {
    setOpenDropdown((previous) => (previous === sectionName ? null : sectionName));
  };

  return (
    <div className="h-full w-[280px] overflow-y-auto border-r border-gray-300 bg-white px-4 py-6 dark:border-gray-700 dark:bg-semiblack dark:text-white">
      <div className="flex flex-col gap-3">
        {DocsData.map((section) => {
          const isOpen = openDropdown === section.name;

          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => toggleDropdown(section.name)}
                className="flex items-center gap-3"
              >
                {isOpen ? (
                  <ChevronDown size={18} color={currentThemeClass} />
                ) : (
                  <ChevronRight size={18} color={currentThemeClass} />
                )}
                <p className="text-sm">{section.name}</p>
              </button>

              {isOpen && (
                <div className="ml-8 mt-2 flex flex-col gap-2 text-sm">
                  {section.dropdowns.map((item) => {
                    const isActive = item.slug === activeSlug;
                    return (
                      <Link
                        key={item.id}
                        href={`/site/docs/${item.slug}`}
                        className={`rounded px-1 py-0.5 text-start transition ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
