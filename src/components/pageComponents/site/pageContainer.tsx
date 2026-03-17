"use client";
import MainNavbar from "./navbar";

export default function PageContainer({ children }: _IChildren) {
  return (
    <main>
      <div>
        <div>
          <MainNavbar />
        </div>

        <div className="mt-16 z-20 relative">{children}</div>
      </div>
    </main>
  );
}
