"use client";
import MainNavbar from "./navbar";
import { ThemeProvider } from "../../../context/themeContext";

export default function PageContainer({ children }: _IChildren) {
  return (
    <main>
      <ThemeProvider>
        <div>
          <div>
            <MainNavbar />
          </div>

          <div className="mt-16 z-20 relative">{children}</div>
        </div>
      </ThemeProvider>
    </main>
  );
}
