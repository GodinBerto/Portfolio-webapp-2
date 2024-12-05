import MainNavbar from "./navbar";
import Footer from "./footer";
import { ThemeProvider } from "../themes/themeContext/themeContext";

export default function PageContainer({ children }: any) {
  return (
    <main>
      <ThemeProvider>
        <div>
          <div>
            <MainNavbar />
          </div>
          <div className="">{children}</div>
          <div>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </main>
  );
}
