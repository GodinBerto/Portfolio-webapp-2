import { ReactNode } from "react";
import MainNavbar from "./navbar";

export default function PageContainer({ children }: any) {
  return (
    <main>
      <div>
        <div>
          <MainNavbar />
        </div>
        {children}
      </div>
    </main>
  );
}
