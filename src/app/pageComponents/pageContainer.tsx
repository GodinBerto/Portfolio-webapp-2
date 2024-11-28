import { ReactNode } from "react";
import MainNavbar from "./navbar";
import Footer from "./footer";

export default function PageContainer({ children }: any) {
  return (
    <main>
      <div>
        <div>
          <MainNavbar />
        </div>
        {children}
        <div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
