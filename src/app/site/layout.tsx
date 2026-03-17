'use client";';
import PageContainer from "@/components/pageComponents/site/pageContainer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="fixed w-full z-0 inset-0"></div>

      <PageContainer>{children}</PageContainer>
    </div>
  );
}
