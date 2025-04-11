import MainNavbar from "./navbar";
import { ThemeProvider } from "../../app/themes/themeContext/themeContext";

export default function PageContainer({ children }: _IChildren) {
  return (
    <main>
      <ThemeProvider>
        <div>
          <div>
            <MainNavbar />
          </div>

          <div className="mt-16">{children}</div>
        </div>
      </ThemeProvider>
    </main>
  );
}
