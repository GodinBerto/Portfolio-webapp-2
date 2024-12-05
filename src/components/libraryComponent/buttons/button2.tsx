import { useTheme } from "@/app/themes/themeContext/themeContext";

export default function Button2({ children }: { children: string }) {
  const { theme } = useTheme();

  // Map themes to Tailwind classes
  const themeClasses: { [key: string]: string } = {
    red: "border-[#C80404] text-[#C80404]",
    yellow: "border-yellow-600 text-yellow-600",
    blue: "border-blue-600 text-blue-600",
    green: "border-green-600 text-green-600",
  };

  // Determine the current class string
  const currentThemeClass =
    themeClasses[theme] || "bg-[#1e3a8a] border-[#1e3a8a]"; // Default to blue if theme not found

  return (
    <button
      className={`py-2 px-6 rounded-md ${currentThemeClass} border-2 h-10 flex items-center transition-transform transform hover:scale-110`}
    >
      {children}
    </button>
  );
}
