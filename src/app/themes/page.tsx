"use client";
import { ArrowRightFromLine } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTheme } from "./themeContext/themeContext";

interface ThemesProps {
  closeThemes: () => void; // Define the type for closeThemes explicitly
}

export default function Themes({ closeThemes }: ThemesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { changeTheme } = useTheme();

  useEffect(() => {
    // Trigger animation when the component mounts
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(closeThemes, 300);
  };

  const themes = [
    { name: "Red", colors: "#C80404" },
    { name: "Yellow", colors: "#DCCA00" },
    { name: "Blue", colors: "#1e3a8a" },
    { name: "Green", colors: "#00BF56" },
  ];

  return (
    <div
      className={`fixed top-20 right-0 bg-white dark:bg-gray-900 shadow-lg p-6 rounded-l-lg transform transition-transform duration-300 w-full md:w-[400px] dark:text-gray-300 z-30 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Themes</h2>
        <button
          onClick={handleClose}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowRightFromLine size={20} />
        </button>
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-lg font-medium dark:text-white">
            Background Themes
          </h3>
          <div className="mt-4 flex gap-4 flex-wrap">
            {themes.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div
                  onClick={() => changeTheme(item.name.toLowerCase())}
                  className="p-2 flex gap-1 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: item.colors }}
                  ></div>
                </div>
                <h4 className="mt-2 text-sm dark:text-gray-300">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
