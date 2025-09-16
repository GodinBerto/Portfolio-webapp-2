"use client";
import { useState } from "react";
import { useTheme } from "@/context/themeContext";
import { themeClasses } from "@/constants/themes";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DocsData } from "@/app/site/docs/data";

export default function Sidebar() {
  const { theme } = useTheme();
  const currentThemeClass = themeClasses[theme] || "green";

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (section: string) => {
    setOpenDropdown((prev) => (prev === section ? null : section));
  };

  const handleButtonClick = (label: string) => {
    console.log(`Clicked: ${label}`);
    // You can add routing or other logic here
  };

  return (
    <div className="dark:text-white border-r-[1px] dark:border-gray-700 border-gray-300 h-full w-[300px] fixed py-6 px-4 overflow-y-auto dark:bg-semiblack bg-white">
      <div className="flex flex-col gap-3">
        {DocsData.map((section) => {
          const isOpen = openDropdown === section.name;

          return (
            <div key={section.id}>
              <button
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
                <div className="ml-8 flex flex-col gap-2 text-sm text-gray-400 mt-2">
                  {section.dropdowns.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleButtonClick(item.name)}
                      className="text-start"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
