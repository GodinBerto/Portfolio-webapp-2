import Footer from "./footer";

export default function PageContainerWithFooter({ children }: _IChildren) {
  return (
    <div className="">
      <div>{children}</div>
      <div className="w-[calc(100vw-300px)]">
        <Footer />
      </div>
    </div>
  );
}
