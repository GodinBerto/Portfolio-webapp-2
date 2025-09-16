"use client";
import Link from "next/link";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";
import { useTheme } from "@/context/themeContext";

export default function Builder() {
  const { theme } = useTheme();
  const themeColor: { [key: string]: string } = {
    red: "red",
    yellow: "yellow",
    blue: "blue",
    green: "green",
  };
  const currentTheme = themeColor[theme] || themeColor["blue"];
  return (
    <>
      <PageContainerWithFooter fullWidth={true}>
        <div className="my-32 relative">
          {/* Hero section */}
          <section className="flex justify-center">
            <div className="max-w-7xl w-full justify-center flex flex-col text-center">
              {/* Left Text Content */}
              <p
                className={`border-[2px] border-gray-600 bg-${currentTheme}-600/40 w-fit mx-auto px-3 py-1 rounded-full text-sm mb-4 text-${currentTheme}-600 font-medium`}
              >
                Builder
              </p>
              <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
                Build a site fast with the <br /> magic of AI
              </h1>
              <ul className="space-y-2 text-lg text-gray-800 dark:text-gray-200 mb-6">
                <li>✓ Get online in just minutes</li>
                <li>✓ AI builder & beautiful website templates</li>
                <li>✓ Easy drag-and-drop builder</li>
                <li>✓ One free hour of web design support*</li>
              </ul>
              <Link href="/builder">
                <button
                  className={`bg-${currentTheme}-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-${currentTheme}-800 transition`}
                >
                  START BUILDING
                </button>
              </Link>
            </div>
          </section>
        </div>
      </PageContainerWithFooter>
    </>
  );
}
