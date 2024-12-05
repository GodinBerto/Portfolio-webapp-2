"use client";

import Rain from "./animations/rain";
import WaterEdgeAnimation from "./animations/waterEdgeAnimation";
import Button1 from "@/components/libraryComponent/buttons/button1";
import { useTheme } from "./themes/themeContext/themeContext";
import Button2 from "@/components/libraryComponent/buttons/button2";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();

  const themeClasses: {
    [key: string]: {
      button1: string;
      text: string;
      button2: string;
      buttonHover: string;
    };
  } = {
    red: {
      button1: "bg-red-600 border-red-600",
      text: "text-red-600",
      button2: "border-red-600 text-red-600",
      buttonHover: "hover:bg-red-600",
    },
    yellow: {
      button1: "bg-yellow-500 border-yellow-s00",
      button2: "border-yellow-500 text-yellow-500",
      text: "text-yellow-500",
      buttonHover: "hover:bg-yellow-500",
    },
    blue: {
      button1: "bg-blue-500 border-blue-500",
      button2: "border-blue-500 text-blue-500",
      text: "text-blue-500",
      buttonHover: "hover:bg-blue-500",
    },
    green: {
      button1: "bg-green-600 border-green-600",
      button2: "border-green-600 text-green-600",
      text: "text-green-600",
      buttonHover: "hover:bg-green-600",
    },
  };

  // Ensure to default to blue theme if theme is not valid or undefined
  const currentTheme = themeClasses[theme] || themeClasses["blue"];
  console.log("Current Theme:", theme);

  console.log("text from me: ", currentTheme.text);

  return (
    <div className="h-full mt-10 flex justify-center items-center flex-col gap-20">
      <div className="w-full flex flex-wrap md:gap-32 justify-center px-3 md:px-0">
        <div className="w-[400px] flex flex-col">
          <div className="flex flex-col gap-4 dark:text-white">
            <h1 className={`font-semibold text-sm ${currentTheme.text}`}>
              Welcome to Berto&apos;Studio
            </h1>
            <h2 className="font-bold text-5xl">
              Enhance your site with stunning,
              <span className={`${currentTheme.text}`}> ready-to-use</span>{" "}
              components today!
            </h2>
            <p className="dark:text-gray-400 text-gray-600">
              We specialize in providing high-quality components tailored to
              make your web development faster, easier, and more stylish.
              Whether you need sleek navigation menus, dynamic content sections,
              or feature-packed widgets, we&apos;ve got you covered.
            </p>
            <div className="flex gap-6 flex-wrap">
              <Button1>Get Started</Button1>

              <Button2>View Components</Button2>
            </div>
          </div>
        </div>
        <div className="min-w-[700px] dark:text-white ">
          <Rain />
        </div>
      </div>
      <div className=" relative z-10 h-[300px] w-screen">
        <div>
          <WaterEdgeAnimation speed={2} />
        </div>
        <div className="absolute top-10">
          <WaterEdgeAnimation speed={1.5} />
        </div>
        <div className="absolute top-20">
          <WaterEdgeAnimation speed={1} />
        </div>
      </div>
      <div className="flex w-full my-5 justify-center dark:text-white">
        <div className="flex gap-4 flex-wrap ">
          <div className="w-[330px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 ">
                <h1 className={`font-semibold text-sm ${currentTheme.text}`}>
                  Components Library
                </h1>
                <h2 className="font-bold text-3xl">
                  Effortless{" "}
                  <span className={`${currentTheme.text}`}>Reusable</span>{" "}
                  Components for Everyone
                </h2>
                <p className="dark:text-gray-400 text-gray-600">
                  Discover seamless, reusable components that simplify
                  development and enhance efficiency.
                </p>
              </div>
              <div className="w-full p-3 rounded-lg border-[1.5px] border-gray-100 dark:border-gray-700 dark:bg-white/5 bg-black/5 backdrop-blur-lg shadow-md">
                <div className="flex flex-col items-center ">
                  <Link
                    href={"#"}
                    className={`p-2 w-full flex justify-center ${currentTheme.buttonHover} rounded-md hover:text-white`}
                  >
                    Buttons
                  </Link>
                  <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                  <Link
                    href={"#"}
                    className={`p-2 w-full flex justify-center ${currentTheme.buttonHover} rounded-md hover:text-white`}
                  >
                    Forms
                  </Link>
                  <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                  <Link
                    href={"#"}
                    className={`p-2 w-full flex justify-center ${currentTheme.buttonHover} rounded-md hover:text-white`}
                  >
                    Cards
                  </Link>
                  <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                  <Link
                    href={"#"}
                    className={`p-2 w-full flex justify-center ${currentTheme.buttonHover} rounded-md hover:text-white gap-5`}
                  >
                    View more componenets{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray"></div>
        </div>
      </div>
    </div>
  );
}
