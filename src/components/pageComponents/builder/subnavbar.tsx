"use client";

import Toolbar from "./toolbar";

export default function BuilderSubNavbar() {
  return (
    <div className="flex h-[46px] items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-semiblack">
      <Toolbar />
      <p className="hidden text-xs text-gray-500 dark:text-gray-400 xl:block">
        Tools: `V` Select, `H` Hand, `X` Text, `/` Chat, `E` Reactions
      </p>
    </div>
  );
}
