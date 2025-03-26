import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the context type
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context
const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

// Provider component
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Use useEffect to ensure `localStorage` is accessed only after mounting
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("dark") === "true";
    setDarkMode(savedDarkMode); // Set the state with the saved dark mode preference

    // Update the <html> element based on the darkMode state
    const html = document.documentElement;
    if (savedDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []); // Run this effect only once after the initial render

  // Update localStorage and the HTML class when darkMode changes
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("dark", "true"); // Save dark mode preference
    } else {
      html.classList.remove("dark");
      localStorage.setItem("dark", "false"); // Save light mode preference
    }
  }, [darkMode]); // Runs whenever `darkMode` changes

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook to use the context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
