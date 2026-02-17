"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DocsData } from "@/app/site/docs/data";

type DocsMiniSidebarProps = {
  currentSlug?: string;
};

export default function DocsMiniSidebar({ currentSlug }: DocsMiniSidebarProps) {
  const pathname = usePathname();

  const activeSlug = useMemo(() => {
    if (currentSlug) return currentSlug;
    const chunks = pathname.split("/").filter(Boolean);
    return chunks[chunks.length - 1] ?? "introduction";
  }, [currentSlug, pathname]);

  return (
    <div className="h-full w-[220px] overflow-y-auto border-l border-gray-300 bg-white px-3 py-6 dark:border-gray-700 dark:bg-semiblack">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Docs Sections
      </p>

      <div className="space-y-4">
        {DocsData.map((section) => (
          <div key={section.id}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {section.name}
            </p>

            <div className="space-y-1">
              {section.dropdowns.map((item) => {
                const isActive = item.slug === activeSlug;

                return (
                  <Link
                    key={item.id}
                    href={`/site/docs/${item.slug}`}
                    className={`block rounded-md px-2 py-1 text-xs transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
