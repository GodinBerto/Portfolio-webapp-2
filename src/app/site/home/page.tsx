"use client";

import Button1 from "@/components/do-not-touch/buttons/button1";
import Button2 from "@/components/do-not-touch/buttons/button2";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonString1, ButtonString2 } from "@/constants/compoonentString";
import WaterEdgeAnimation from "@/components/pageComponents/animations/waterEdgeAnimation";
import Rain from "@/components/pageComponents/animations/rain";
import PrismLoader from "@/components/pageComponents/site/prismLoader";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";
import { useTheme } from "@/context/themeContext";

export default function HomePage() {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState("");
  const [codeString, setCodeString] = useState(ButtonString1);

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

  useEffect(() => {
    ButtonClicked("Button1");
  }, []);

  const ButtonClicked = (button: string) => {
    setActiveButton(button);
    if (button === "Button1") {
      setCodeString(ButtonString1);
    } else if (button === "Button2") {
      setCodeString(ButtonString2);
    } else {
      setCodeString("no components found");
    }
  };

  return (
    <>
      <PageContainerWithFooter>
        <div className="h-full mt-[100px] flex justify-center items-center flex-col gap-20 ">
          <div className="w-full flex flex-wrap md:gap-32 justify-center px-3 md:px-0">
            <div className="w-[400px] flex flex-col">
              <div className="flex flex-col gap-4 dark:text-white">
                <h1 className={`font-semibold text-sm ${currentTheme.text}`}>
                  Welcome to Berto&apos;Studio
                </h1>
                <h2 className="font-bold text-5xl">
                  Enhance your site with stunning,
                  <span className={`${currentTheme.text}`}>
                    {" "}
                    ready-to-use
                  </span>{" "}
                  components today!
                </h2>
                <p className="dark:text-gray-400 text-gray-600">
                  We specialize in providing high-quality components tailored to
                  make your web development faster, easier, and more stylish.
                  Whether you need sleek navigation menus, dynamic content
                  sections, or feature-packed widgets, we&apos;ve got you
                  covered.
                </p>
                <div className="flex gap-6 flex-wrap">
                  <Button1>Get Started</Button1>

                  <Button2>View Components</Button2>
                </div>
              </div>
            </div>
            <div className="min-w-[600px] dark:text-white hidden xl:block">
              <Rain />
            </div>
          </div>
          <div className=" relative z-10 h-[300px] ">
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
          <div className="flex w-full my-5 justify-center dark:text-white px-3">
            <div className="flex flex-wrap gap-6 justify-center">
              {/* Left Column */}
              <div className="w-full sm:w-[320px] lg:w-[350px]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h1
                      className={`font-semibold text-sm ${currentTheme.text}`}
                    >
                      Components Library
                    </h1>
                    <h2 className="font-bold text-2xl sm:text-3xl">
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
                    <div className="flex flex-col items-center gap-2">
                      <Link
                        href={"#ComponentContainer"}
                        onClick={() => ButtonClicked("Button1")}
                        className={`p-2 w-full flex justify-center ${
                          activeButton === "Button1"
                            ? currentTheme.button1
                            : currentTheme.buttonHover
                        } rounded-md hover:text-white`}
                      >
                        Buttons
                      </Link>
                      <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                      <Link
                        href={"#ComponentContainer"}
                        onClick={() => ButtonClicked("Forms")}
                        className={`p-2 w-full flex justify-center ${
                          activeButton === "Forms"
                            ? currentTheme.button1
                            : currentTheme.buttonHover
                        } rounded-md hover:text-white`}
                      >
                        Forms
                      </Link>
                      <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                      <Link
                        href={"#ComponentContainer"}
                        onClick={() => ButtonClicked("Cards")}
                        className={`p-2 w-full flex justify-center ${
                          activeButton === "Cards"
                            ? currentTheme.button1
                            : currentTheme.buttonHover
                        } rounded-md hover:text-white`}
                      >
                        Cards
                      </Link>
                      <div className="w-[90%] dark:bg-gray-700 h-[1px] bg-gray-300"></div>
                      <Link
                        href={"#"}
                        className={`p-2 w-full flex justify-center ${currentTheme.buttonHover} rounded-md hover:text-white gap-5`}
                        onClick={() => ButtonClicked("")}
                      >
                        View more components{" "}
                        <span>
                          <ArrowRight />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div
                className="w-[320px] lg:w-[800px] max-h-[500px] border-[1.5px] border-gray-100 dark:border-gray-700 rounded-md p-6 flex gap-6 flex-col overflow-auto"
                id="ComponentContainer"
              >
                <div className="w-full flex justify-center relative">
                  <div className="flex gap-4 sm:gap-10 absolute top-0">
                    <Button1
                      onClick={() => ButtonClicked("Button1")}
                      className="w-32 sm:w-40"
                    >
                      Button1
                    </Button1>
                  </div>
                </div>
                <div className="w-[100%] dark:bg-gray-700 h-[1px] bg-gray-100"></div>
                <PrismLoader code={codeString} />
              </div>
            </div>
          </div>
        </div>
      </PageContainerWithFooter>
    </>
  );
}
