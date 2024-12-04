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
        <div className="">{children}</div>
        <div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
