"use client";

import Discord from "@/app/icons/discord";
import Linkedln from "@/app/icons/linkdln";
import { useTheme } from "@/context/themeContext";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer({ hidden = false, fullWidth = true }: Hidden) {
  const { theme } = useTheme();

  const themeClasses: {
    [key: string]: { button1: string; text: string; textHover: string };
  } = {
    red: {
      button1: "bg-red-600  hover:bg-red-700",
      textHover: "hover:text-red-600 dark:hover:text-red-600",
      text: "text-red-600",
    },
    yellow: {
      button1: "bg-yellow-500  hover:bg-yellow-600",
      textHover: "hover:text-yellow-500 dark:hover:text-yellow-500",
      text: "text-yellow-500",
    },
    blue: {
      button1: "bg-blue-500  hover:bg-blue-600",
      textHover: "hover:text-blue-600 dark:hover:text-blue-600",
      text: "text-blue-500",
    },
    green: {
      button1: "bg-green-600  hover:bg-green-700",
      textHover: "hover:text-green-600 dark:hover:text-green-600",
      text: "text-green-600",
    },
  };

  // Ensure to default to blue theme if theme is not valid or undefined
  const currentTheme = themeClasses[theme] || themeClasses["blue"];
  return (
    <footer
      className={`p-6 dark:text-white border-t-[1px] dark:border-gray-700 flex flex-col gap-6 items-center ${
        fullWidth ? "w-full" : "w-auto"
      } ${hidden ? "hidden" : ""}`}
    >
      {/* Main container */}
      <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-7xl gap-10 lg:gap-20">
        {/* Left section */}
        <div className="flex flex-col gap-7 w-full lg:w-[40%]">
          <h1 className={`ont-semibold text-sm ${currentTheme.text}`}>
            Berto&apos;Studio
          </h1>
          <div>
            <h2 className="text-lg font-semibold text-semiblack dark:text-white">
              Keep up to date
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated! Join my newsletter to be the first to know about new
              features and updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@gmail.com"
              className="flex-grow dark:bg-searchColor border-gray-600 rounded-md border-2 h-10 px-3 focus:border-green-600 outline-none focus:ring-0 dark:focus:border-gray-600 dark:text-gray-400"
            />
            <button
              type="submit"
              className={`${currentTheme.button1} h-10 px-6 rounded-md text-white flex items-center justify-center `}
            >
              Subscribe
            </button>
          </div>
          <div className="flex gap-4">
            <Link href={"#"}>
              <Github className="text-semiblack dark:text-white w-8 h-8" />
            </Link>
            <Link href={"#"}>
              <Linkedln className="text-semiblack dark:text-white w-8 h-8" />
            </Link>
            <Link href={"#"}>
              <Discord className="text-semiblack dark:text-white w-8 h-8" />
            </Link>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-wrap justify-between w-full  gap-10">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <h1 className="text-md font-semibold text-semiblack dark:text-white">
              Resources
            </h1>
            <div className="flex flex-col gap-1">
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Templates
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Components
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Customization
              </Link>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <h1 className="text-md font-semibold text-semiblack dark:text-white">
              Explore
            </h1>
            <div className="flex flex-col gap-1">
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Documentation
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Prices
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Blog
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Road Map
              </Link>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <h1 className="text-md font-semibold text-semiblack dark:text-white">
              Profile
            </h1>
            <div className="flex flex-col gap-1">
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                About Me
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Vision
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Careers
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Contact Me
              </Link>
              <Link
                href="#"
                className={`text-gray-600 dark:text-gray-400 ${currentTheme.textHover}`}
              >
                Support Me
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Copyright © 2024 Berto&apos;Studio.
        </p>
      </div>
    </footer>
  );
}
