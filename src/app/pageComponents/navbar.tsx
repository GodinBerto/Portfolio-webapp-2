"use client";

import { Moon, Search, SlidersHorizontal, Sun } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDarkMode } from "../context/darkModeContext";
import Themes from "../themes/page";

export default function MainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemes, setShowThemes] = useState(false); // State to toggle Themes visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
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
        className={`p-3 shadow-md backdrop-blur-md dark:text-white dark:border-b-[1px] dark:border-gray-700 z-20 ${
          isScrolled ? "fixed top-0" : "relative"
        } w-full bg-white dark:bg-semiblack transition-all duration-300`}
      >
        <div className="flex justify-between items-center px-4 lg:px-[10rem]">
          {/* Brand Section */}
          <div>
            <h1 className="text-green-600">Berto&apos;Studio</h1>
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-4">
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack"
            >
              Docs
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack"
            >
              Product
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack"
            >
              Pricing
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md hover:dark:border-searchColor hover:dark:border-[1px] border-[1px] border-white hover:border-semiblack dark:border-semiblack"
            >
              Portfolio
            </Link>
          </ul>

          {/* Action Section */}
          <div className="flex gap-5 items-center dark:text-gray-400">
            {/* Search Bar */}
            <div className="hidden lg:flex justify-center items-center rounded-md dark:bg-searchColor dark:border-gray-600 border-searchColor border-[2px] px-2 h-10 w-64">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent outline-none border-none focus:outline-none focus:ring-0 dark:bg-transparent text-sm px-2"
              />
              <button>
                <Search />
              </button>
            </div>

            {/* Theme Toggle */}
            <SlidersHorizontal
              onClick={() => setShowThemes((prev) => !prev)}
              className="cursor-pointer"
            />

            {/* Dark Mode Toggle */}
            <div className="relative w-6 h-10 flex items-center justify-center overflow-hidden">
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

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <div className="space-y-1">
                <span className="block h-[3px] w-6 bg-current"></span>
                <span className="block h-[3px] w-6 bg-current"></span>
                <span className="block h-[3px] w-6 bg-current"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col mt-4 space-y-2 px-4">
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md"
            >
              Docs
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md"
            >
              Product
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md"
            >
              Pricing
            </Link>
            <Link
              href={"#"}
              className="text-sm hover:dark:bg-gray-800 p-[5px] rounded-md"
            >
              About Us
            </Link>
          </div>
        )}
      </div>

      {/* Render Themes page conditionally */}
      {showThemes && <Themes closeThemes={closeThemes} />}
    </>
  );
}
