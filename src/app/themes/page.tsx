"use client";
import { ArrowRightFromLine } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTheme } from "./themeContext/themeContext";

export default function Themes({ closeThemes }: any) {
  const [isVisible, setIsVisible] = useState(false);
  const { theme, changeTheme } = useTheme(); // Access the current theme and changeTheme function

  useEffect(() => {
    // Trigger animation when the component mounts
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    // Trigger the slide-out animation before closing
    setIsVisible(false);
    setTimeout(closeThemes, 300); // Wait for animation to finish before closing
  };

  const themes = [
    { name: "red", colors: "rgb(220 38 38)" },
    { name: "yellow", colors: "rgb(202 138 4)" },
    { name: "blue", colors: "rgb(37 99 235)" },
    { name: "green", colors: "rgb(22 163 74)" },
  ];

  const handleThemeChange = (newTheme: string) => {
    changeTheme(newTheme); // Update the theme using context
  };

  return (
    <div
      className={`fixed top-20 right-0 bg-white dark:bg-gray-900 shadow-lg p-6 rounded-l-lg transform transition-transform duration-300 w-screen md:w-[400px] dark:text-gray-300 z-20 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Themes</h2>
        <button
          onClick={handleClose}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowRightFromLine size={20} />
        </button>
      </div>

      {/* Theme Sections */}
      <div className="mt-6 space-y-8">
        {/* Background Themes */}
        <div>
          <h3 className="text-lg font-medium dark:text-white">
            Background Themes
          </h3>
          <div className="mt-4 flex gap-4 flex-wrap">
            {themes.map((themeItem) => (
              <div key={themeItem.name} className="flex flex-col items-center">
                <div
                  className="p-2 flex gap-1 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
                  onClick={() => handleThemeChange(themeItem.name)} // Change the theme when clicked
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: themeItem.colors }}
                  ></div>
                </div>
                <h4 className="mt-2 text-sm dark:text-gray-300">
                  {themeItem.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Button Themes */}
        <div>
          <h3 className="text-lg font-medium dark:text-white">Button Themes</h3>
          <div className="mt-4 flex gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Primary
            </button>
            <button className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600">
              Secondary
            </button>
          </div>
        </div>

        {/* Text Themes */}
        <div>
          <h3 className="text-lg font-medium dark:text-white">Text Themes</h3>
          <div className="mt-4">
            <p className="text-base text-gray-800 dark:text-gray-300">
              Example of <span className="font-bold">bold text</span>,{" "}
              <span className="italic">italic text</span>, and{" "}
              <span className="underline">underlined text</span>.
            </p>
          </div>
        </div>

        {/* Apply Button */}
        <div className="text-center">
          <button className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
