import Footer from "./footer";

export default function PageContainerWithFooter({
  children,
  fullWidth,
}: PageContainerWithFooterProps) {
  return (
    <div className="">
      <div>{children}</div>
      <div className={`${fullWidth ? "w-screen" : "w-[calc(100vw-315px)]"}`}>
        <Footer fullWidth={fullWidth} />
      </div>
    </div>
  );
}
