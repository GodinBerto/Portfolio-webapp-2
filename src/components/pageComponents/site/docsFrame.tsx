import Sidebar from "./sidebar";

export default function DocsFrame({ children }: _IChildren) {
  return (
    <div className="h-[calc(100vh-65px)] flex w-full">
      <div>
        <Sidebar />
      </div>
      <div className="ml-[300px] mt-[3px]">{children}</div>
    </div>
  );
}
