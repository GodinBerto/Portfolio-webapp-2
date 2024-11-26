import { ArrowRightFromLine } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function Themes({ closeThemes }: any) {
  const [isVisible, setIsVisible] = useState(false);

  const date = new Date();
  console.log(date);
  console.log(Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date));

  useEffect(() => {
    // Trigger animation when the component mounts
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    // Trigger the slide-out animation before closing
    setIsVisible(false);
    setTimeout(closeThemes, 300); // Wait for animation to finish before closing
  }; //redo

  return (
    <div
      className={`fixed top-20 right-0 bg-white dark:bg-searchColor shadow-lg p-4 rounded-l-md transform transition-transform duration-300 w-[400px] ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold dark:text-white">Themes</h2>
        <button
          onClick={handleClose}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowRightFromLine />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-6">
        {/* Add theme-related content here */}
        <div>
          <h1>Background Themes</h1>
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col items-center">
              <div className="bg-[url('/themes/mainTheme.png')] w-20 h-20 bg-cover rounded-md border-[1px] border-white dark:border-gray-700"></div>
              <h2>Dark</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[url('/themes/mainTheme.png')] w-20 h-20 bg-cover rounded-md border-[1px] border-white dark:border-gray-700"></div>
              <h2>Dark</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[url('/themes/mainTheme.png')] w-20 h-20 bg-cover rounded-md border-[1px] border-white dark:border-gray-700"></div>
              <h2>Dark</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[url('/themes/mainTheme.png')] w-20 h-20 bg-cover rounded-md border-[1px] border-white dark:border-gray-700"></div>
              <h2>Dark</h2>
            </div>
          </div>
        </div>

        <div>
          <h1>Heading Three</h1>
          <div>Button Themes</div>
        </div>
        <div>
          <h1>Heading Two</h1>
          <div>Text Themes</div>
        </div>
        <div>
          <h1>Text Style</h1>
          <div></div>
        </div>
        <div>
          <button>Apply</button>
        </div>
      </div>
    </div>
  );
}
