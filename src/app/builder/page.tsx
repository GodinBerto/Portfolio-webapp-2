"use client";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { v4 as uuid } from "uuid";

interface BuilderComponent {
  id: string;
  type: "button" | "text";
  props: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export default function Home() {
  const [components, setComponents] = useState<BuilderComponent[]>([]);

  const addComponent = (type: "button" | "text") => {
    setComponents([
      ...components,
      {
        id: uuid(),
        type,
        props: type === "button" ? { label: "Click Me" } : { text: "Hello" },
        position: { x: 100, y: 100, w: 150, h: 50 },
      },
    ]);
  };

  return (
    <div className="h-screen ml-[300px] w-full overflow-hidden">
      {/* Sidebar */}
      {/* <div className="fixed top-[60px] left-0 w-[256px] h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-800 p-4 z-10">
        <h2 className="font-bold mb-4">Components</h2>
        <button
          className="w-full mb-2 p-2 bg-blue-500 text-white rounded"
          onClick={() => addComponent("button")}
        >
          Add Button
        </button>
        <button
          className="w-full p-2 bg-green-500 text-white rounded"
          onClick={() => addComponent("text")}
        >
          Add Text
        </button>
      </div> */}

      {/* Canvas */}
      <div className="fixed top-[60px] left-[256px] right-0 bottom-0 bg-white dark:bg-black overflow-hidden">
        {components.map((c) => (
          <Rnd
            key={c.id}
            default={{
              x: c.position.x,
              y: c.position.y,
              width: c.position.w,
              height: c.position.h,
            }}
            bounds="parent"
          >
            {c.type === "button" && (
              <button className="w-full h-full bg-blue-600 text-white rounded">
                {c.props.label}
              </button>
            )}
            {c.type === "text" && (
              <div className="w-full h-full flex items-center justify-center text-lg">
                {c.props.text}
              </div>
            )}
          </Rnd>
        ))}
      </div>
    </div>
  );
}
