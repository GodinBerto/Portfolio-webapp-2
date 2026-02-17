import DocsMiniSidebar from "./docsMiniSidebar";
import Sidebar from "./sidebar";

type DocsFrameProps = {
  children: React.ReactNode;
  currentSlug?: string;
};

export default function DocsFrame({ children, currentSlug }: DocsFrameProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full">
      <div className="hidden shrink-0 md:block">
        <div className="sticky top-16 h-[calc(100vh-64px)]">
          <Sidebar currentSlug={currentSlug} />
        </div>
      </div>

      <div className="min-w-0 flex-1">{children}</div>

      <div className="hidden shrink-0 xl:block">
        <div className="sticky top-16 h-[calc(100vh-64px)]">
          <DocsMiniSidebar currentSlug={currentSlug} />
        </div>
      </div>
    </div>
  );
}
