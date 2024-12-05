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

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    }
    setTheme(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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
