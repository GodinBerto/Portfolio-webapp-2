"use client";

import WaterEdgeAnimation from "@/app/animations/waterEdgeAnimation";
import PageContainer from "@/app/pageComponents/pageContainer";

export default function MainPage() {
  return (
    <PageContainer>
      <div className="w-screen h-screen flex justify-center items-center flex-col gap-20">
        <div className="flex flex-wrap gap-10">
          <div className="w-[400px] flex flex-col">
            <div className="flex flex-col gap-4 dark:text-white">
              <h1 className="font-semibold text-sm text-green-600">
                Welcome to Berto'Studio
              </h1>
              <h2 className="font-bold text-5xl">
                Enhance your site with stunning,
                <span className="text-green-600"> ready-to-use</span> components
                today!
              </h2>
              <p className="dark:text-gray-400 text-gray-600">
                We specialize in providing high-quality components tailored to
                make your web development faster, easier, and more stylish.
                Whether you need sleek navigation menus, dynamic content
                sections, or feature-packed widgets, we’ve got you covered.
              </p>
              <div className="flex gap-6">
                <button className="border-none outline-none px-6 py-2 bg-green-600 rounded-md transition-transform transform hover:scale-110 text-white">
                  Get Started
                </button>
                <button className="border-green-600 border-2 outline-none px-6 py-2 rounded-md text-green-600 hover:bg-green-600 hover:text-white transition-transform transform hover:scale-110">
                  View Components
                </button>
              </div>
            </div>
          </div>
          <div className="min-w-[500px]"></div>
        </div>
        <div className=" relative">
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
    </PageContainer>
  );
}
