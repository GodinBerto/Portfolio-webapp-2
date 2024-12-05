"use client";

import Rain from "./animations/rain";
import WaterEdgeAnimation from "./animations/waterEdgeAnimation";
import Button1 from "@/components/libraryComponent/buttons/button1";
import { useTheme } from "./themes/themeContext/themeContext";
import Button2 from "@/components/libraryComponent/buttons/button2";

export default function Home() {
  const { theme } = useTheme();

  const themeClasses: {
    [key: string]: { button1: string; text: string; button2: string };
  } = {
    red: {
      button1: "bg-red-600 border-red-600",
      text: "text-red-600",
      button2: "border-red-600 text-red-600",
    },
    yellow: {
      button1: "bg-yellow-500 border-yellow-s00",
      button2: "border-yellow-500 text-yellow-500",
      text: "text-yellow-500",
    },
    blue: {
      button1: "bg-blue-500 border-blue-500",
      button2: "border-blue-500 text-blue-500",
      text: "text-blue-500",
    },
    green: {
      button1: "bg-green-600 border-green-600",
      button2: "border-green-600 text-green-600",
      text: "text-green-600",
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
    </div>
  );
}
