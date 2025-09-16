import BuilderNavbar from "@/components/pageComponents/builder/navbar";
import BuilderSidebar from "@/components/pageComponents/builder/sidebar";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 h-[60px] z-20">
        <BuilderNavbar />
      </div>

      {/* Sidebar */}
      <div className="fixed top-[60px] left-0 w-[256px] h-[calc(100vh-60px)] z-10">
        <BuilderSidebar />
      </div>

      {/* Canvas Area */}
      <div className="fixed top-[60px] left-[300px] right-0 bottom-0 overflow-hidden bg-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
