"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// import { useDarkMode } from "../../context/darkModeContext";

import Themes from "../../app/themes/page";
import { useTheme } from "../../app/themes/themeContext/themeContext";
import ThemeToggler from "./theme-toggle";

export default function MainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemes, setShowThemes] = useState(false); // State to toggle Themes visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  // const { darkMode, toggleDarkMode } = useDarkMode(); // Access global darkMode state
  const { theme } = useTheme();

  const themeClasses: { [key: string]: string } = {
    red: "text-red-600",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
    green: "text-green-600",
  };

  const currentTheme = themeClasses[theme] || themeClasses["blue"];

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
        className={`py-4 px-5 fixed top-0 w-full bg-white dark:bg-semiblack backdrop-blur-md dark:text-white border-b-[1px] dark:border-gray-700 z-20 transform ${
          isScrolled ? "shadow-lg translate-y-0" : "translate-y-0 shadow-none"
        }`}
      >
        <div className="flex justify-between items-center ">
          {/* Brand Section */}
          <div className="transform transition-all duration-300 hover:scale-105">
            <Link href={"/home"}>
              <h1 className={`${currentTheme}`}>Berto&apos;Studio</h1>
            </Link>
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-4">
            <Link
              href={"/docs"}
              className="text-sm transition-all duration-700 hover:dark:bg-gray-800/80 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-transparent hover:border-semiblack dark:border-transparent hover:scale-105 dark:text-gray-200 text-gray-800"
            >
              Docs
            </Link>
            <Link
              href={"/builder"}
              className="text-sm transition-all duration-200 hover:dark:bg-gray-800/80 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-transparent hover:border-semiblack dark:border-transparent hover:scale-105 dark:text-gray-200 text-gray-800"
            >
              Builder
            </Link>
            <Link
              href={"/components"}
              className="text-sm transition-all duration-200 hover:dark:bg-gray-800/80 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-transparent hover:border-semiblack dark:border-transparent hover:scale-105 dark:text-gray-200 text-gray-800"
            >
              Components
            </Link>
          </ul>

          {/* Action Section */}
          <div className="flex gap-5 items-center dark:text-gray-400">
            {/* Search Bar */}
            <div className="hidden lg:flex justify-center items-center rounded-md dark:bg-searchColor/80 dark:border-gray-600/50 border-searchColor border-[2px] px-2 h-10 w-64 transition-all duration-300 focus-within:border-current">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent outline-none border-none focus:outline-none focus:ring-0 dark:bg-transparent text-sm px-2 transition-colors duration-300"
              />
              <button className="transition-transform duration-200 hover:scale-110">
                <Search />
              </button>
            </div>

            {/* Theme Toggle */}
            <SlidersHorizontal
              onClick={() => setShowThemes((prev) => !prev)}
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
            />

            {/* Dark Mode Toggle */}
            <div className="relative w-6 h-10 flex items-center justify-center overflow-hidden">
              <ThemeToggler />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-200"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <div className="space-y-1">
                <span
                  className={`block h-[3px] w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-[3px] w-6 bg-current transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-[3px] w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden flex flex-col mt-4 space-y-2 px-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Link
            href={"#"}
            className="text-sm hover:dark:bg-gray-800/80 p-[5px] rounded-md transition-all duration-200 hover:translate-x-2"
          >
            Docs
          </Link>
          <Link
            href={"#"}
            className="text-sm hover:dark:bg-gray-800/80 p-[5px] rounded-md transition-all duration-200 hover:translate-x-2"
          >
            Product
          </Link>
          <Link
            href={"#"}
            className="text-sm hover:dark:bg-gray-800/80 p-[5px] rounded-md transition-all duration-200 hover:translate-x-2"
          >
            Pricing
          </Link>
          <Link
            href={"#"}
            className="text-sm hover:dark:bg-gray-800/80 p-[5px] rounded-md transition-all duration-200 hover:translate-x-2"
          >
            About Us
          </Link>
        </div>
      </div>

      {/* Render Themes page conditionally */}
      {showThemes && <Themes closeThemes={closeThemes} />}
    </>
  );
}
