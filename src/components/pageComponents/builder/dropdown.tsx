import { DropdownItemProps } from "@/types/builder";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DropdownItem({
  icon,
  label,
  route,
  children,
}: DropdownItemProps) {
  const [open, setOpen] = useState(false);

  const hasChildren = children && children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      <Link href={route || "#"}>
        <div
          className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 
          dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </div>
          {hasChildren && (
            <span className="ml-auto text-xs text-gray-500">
              <ChevronRight size={14} />
            </span>
          )}
        </div>
      </Link>

      {hasChildren && open && (
        <div className="absolute top-0 left-full mt-0 ml-0 z-50">
          <div
            className=" left-full top-0 mt-0 ml-2 z-50 w-[300px] p-3 
        bg-white dark:bg-semiblack border border-gray-100 dark:border-gray-800 
        rounded-lg shadow-lg overflow-hidden"
          >
            {children.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
