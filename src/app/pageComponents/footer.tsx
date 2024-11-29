import Link from "next/link";
import Github from "../icons/github";
import Linkedln from "../icons/linkdln";
import Discord from "../icons/discord";

export default function Footer() {
  return (
    <footer className="h-[400px] dark:text-white border-t-[1px] dark:border-gray-700 flex justify-center items-center flex-col gap-6">
      <div className="flex gap-32">
        <div className="flex flex-col gap-7 w-[400px]">
          <div>
            <h1 className="font-semibold text-sm text-green-600">
              Berto&apos;Studio
            </h1>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-semiblack dark:text-white">
              Keep up to date
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated! Join my newsletter to be the first to know about new
              features and updates.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@gmail.com"
              className="dark:bg-searchColor border-gray-600 rounded-md border-2 min-w-[300px] h-10 focus:border-green-600 outline-none focus:ring-0 dark:focus:border-gray-600 dark:text-gray-400"
            />
            <button
              type="submit"
              className="bg-green-600 h-10 w-28 rounded-md text-white flex items-center justify-center hover:bg-green-700"
            >
              Subscribe
            </button>
          </div>
          <div className="flex gap-4">
            <Link href={"#"}>
              <Github className={"text-semiblack dark:text-white w-10 h-10"} />
            </Link>
            <Link href={"#"}>
              <Linkedln
                className={"text-semiblack dark:text-white w-10 h-10"}
              />
            </Link>
            <Link href={"#"}>
              <Discord className={"text-semiblack dark:text-white w-10 h-10"} />
            </Link>
          </div>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-md font-semibold text-semiblack dark:text-white">
                Resources
              </h1>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Templates
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Components
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Customization
              </Link>
            </div>
          </div>
          <div className="flex flex-col  gap-6">
            <div>
              <h1 className="text-md font-semibold text-semiblack dark:text-white">
                Explore
              </h1>
            </div>
            <div className="flex flex-col  gap-1">
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Documentation
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Prices
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Blog
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Road Map
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-md font-semibold text-semiblack dark:text-white">
                Profile
              </h1>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                About Me
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Vision
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Careers
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Contact Me
              </Link>
              <Link
                href={"#"}
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
              >
                Support Me
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-sm">Copyright © 2024 Berto&apos;Studio.</p>
      </div>
    </footer>
  );
}
