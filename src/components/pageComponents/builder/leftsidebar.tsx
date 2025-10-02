"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  PlusCircle,
  Layers,
  Sidebar,
} from "lucide-react";
import { RootState } from "@/store/store";
import { setSidebar } from "@/store/slice/builderSlice";

interface LayerItem {
  id: string;
  name: string;
  type: "group" | "item";
  children?: LayerItem[];
}

const initialLayers: LayerItem[] = [
  {
    id: "1",
    name: "Body",
    type: "group",
    children: [
      { id: "2", name: "Banner", type: "item" },
      { id: "3", name: "Navbar", type: "item" },
      {
        id: "4",
        name: "Hero",
        type: "group",
        children: [
          { id: "5", name: "Background", type: "item" },
          {
            id: "6",
            name: "Container",
            type: "group",
            children: [
              {
                id: "7",
                name: "Header",
                type: "group",
                children: [
                  { id: "8", name: "Heading", type: "item" },
                  { id: "9", name: "Paragraph", type: "item" },
                  { id: "10", name: "Buttons", type: "item" },
                ],
              },
              { id: "11", name: "Image", type: "item" },
            ],
          },
        ],
      },
      {
        id: "12",
        name: "Products",
        type: "group",
        children: [
          {
            id: "13",
            name: "Container",
            type: "group",
            children: [
              {
                id: "14",
                name: "Header",
                type: "group",
                children: [
                  { id: "15", name: "Heading", type: "item" },
                  { id: "16", name: "Arc", type: "item" },
                ],
              },
              {
                id: "17",
                name: "Content",
                type: "group",
                children: [
                  { id: "18", name: "Item", type: "item" },
                  { id: "19", name: "Item", type: "item" },
                ],
              },
            ],
          },
        ],
      },
      { id: "20", name: "Features", type: "item" },
      { id: "21", name: "Case Study", type: "item" },
      { id: "22", name: "Pricing", type: "item" },
      { id: "23", name: "Blog", type: "item" },
      { id: "24", name: "CTA", type: "item" },
      { id: "25", name: "Footer", type: "item" },
    ],
  },
];

export default function BuilderLeftSidebar() {
  const dispatch = useDispatch();

  const showSidebar = useSelector(
    (state: RootState) => state.sidebar.showSidebar
  );

  return (
    <aside className=" h-full  overflow-y-auto flex">
      <div className="bg-gray-50 dark:bg-semiblack border-r border-gray-200 dark:border-gray-700 flex items-center flex-col w-[50px]">
        <PlusCircle
          size={28}
          className="m-2 text-gray-500 hover:text-gray-700 cursor-pointer p-1"
          // onClick={() => setShowSidebar(!showSidebar)}
        />
        <Layers
          size={28}
          className="m-2 text-gray-600 hover:text-gray-300 bg-gray-300 hover:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-500 cursor-pointer dark:bg-gray-700 rounded-md p-1 transition-all duration-200"
          onClick={() => dispatch(setSidebar(!showSidebar))}
        />
      </div>
      {showSidebar && (
        <div className="overflow-hidden bg-gray-50 dark:bg-semiblack border-r border-gray-200 dark:border-gray-700 w-[250px]">
          <div className="p-3 flex items-center justify-between gap-2">
            <h1 className=" text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Layers
            </h1>
            <Sidebar
              size={18}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => dispatch(setSidebar(!showSidebar))}
            />
          </div>
          <div className="px-2">
            {initialLayers.map((layer) => (
              <LayerNode key={layer.id} node={layer} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

/* Recursive Tree Component */
function LayerNode({ node }: { node: LayerItem }) {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.type === "group" && node.children?.length;

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 text-sm text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={14} className="mr-1 text-gray-500" />
          ) : (
            <ChevronRight size={14} className="mr-1 text-gray-500" />
          )
        ) : (
          <span className="w-4 mr-1" />
        )}
        {node.type === "group" ? (
          <Folder size={14} className="mr-2 text-blue-500" />
        ) : (
          <File size={14} className="mr-2 text-gray-400" />
        )}
        <span>{node.name}</span>
      </div>

      {hasChildren && expanded && (
        <div className="pl-6">
          {node.children!.map((child) => (
            <LayerNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
