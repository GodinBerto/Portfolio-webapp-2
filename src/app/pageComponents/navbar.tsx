"use client";

import { Moon, Search, SlidersHorizontal, Sun } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDarkMode } from "../context/darkModeContext";
import Themes from "../themes/page";

export default function MainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemes, setShowThemes] = useState(false); // State to toggle Themes visibility
  const { darkMode, toggleDarkMode } = useDarkMode(); // Access global darkMode state

  useEffect(() => {
    // Handle scrolling state
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeThemes = () => setShowThemes(false); // Function to close Themes

  return (
    <>
      <div
        className={`p-3 shadow-md backdrop-blur-md dark:text-white dark:border-b-[1px] dark:border-gray-700 ${
          isScrolled ? "fixed top-0" : "relative"
        } w-screen bg-white dark:bg-semiblack transition-all duration-300 px-[20rem]`}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-20">
            <div>Logo</div>
            <div className="flex items-center">
              <ul className="flex gap-4">
                <Link
                  href={"#"}
                  className={`text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack`}
                >
                  Docs
                </Link>
                <Link
                  href={"#"}
                  className={`text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack`}
                >
                  Product
                </Link>
                <Link
                  href={"#"}
                  className={`text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack`}
                >
                  Pricing
                </Link>
                <Link
                  href={"#"}
                  className={`text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack`}
                >
                  About Us
                </Link>
              </ul>
            </div>
          </div>

          <div className="flex gap-5 items-center dark:text-gray-400">
            <div className="flex justify-center items-center rounded-md dark:bg-searchColor dark:border-gray-600 border-searchColor border-[2px] px-2 h-10 w-64">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent outline-none border-none focus:outline-none focus:ring-0 dark:bg-transparent text-sm px-2"
              />

              <button className="">
                <Search className="" />
              </button>
            </div>
            <div>
              <SlidersHorizontal
                onClick={() => setShowThemes((prev) => !prev)} // Toggle themes visibility
                className="cursor-pointer"
              />
            </div>
            <div className="relative w-6 h-10 flex items-center justify-center overflow-hidden">
              {/* Dark Mode Toggle */}
              {darkMode ? (
                <Sun
                  onClick={toggleDarkMode}
                  className="cursor-pointer text-yellow-500 hover:text-yellow-600 transition-transform duration-300"
                />
              ) : (
                <Moon
                  onClick={toggleDarkMode}
                  className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 transition-transform duration-300"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render Themes page conditionally */}
      {showThemes && <Themes closeThemes={closeThemes} />}
    </>
  );
}
