import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

interface ThemeProps {
  theme: string;
  changeTheme: (newTheme: string) => void;
}

const ThemeContext = createContext<ThemeProps>({
  theme: "green", // default theme
  changeTheme: () => {}, // no-op
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>("green");

  // On initial load, check if there's a saved theme in localStorage
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme); // Set theme from localStorage
    }
  }, []); // This runs only once when the component mounts

  // Whenever the theme changes, update the localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]); // Runs whenever `theme` changes

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;
