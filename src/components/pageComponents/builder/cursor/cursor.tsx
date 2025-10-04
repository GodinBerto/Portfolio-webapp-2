import { useTheme } from "@/context/themes.context";
import { MousePointer, MousePointer2, TextCursor } from "lucide-react";

export default function Cursor({
  colors,
  x,
  y,
  message,
}: {
  colors: string;
  x: number;
  y: number;
  message?: string;
}) {
  const { theme } = useTheme();

  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <MousePointer2
        className={theme === "dark" ? "text-white" : "text-black"}
      />

      {message && (
        <div className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]">
          <p className="whitespace-nowrap">{message}</p>
        </div>
      )}
    </div>
  );
}
