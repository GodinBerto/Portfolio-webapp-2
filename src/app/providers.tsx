"use client";

import PageContainer from "@/components/pageComponents/site/pageContainer";
import { ThemeProvider } from "@/context/themes.context";
interface _IProviders {
  children: React.ReactNode;
  theme: string;
}

const Providers = ({ children, theme }: _IProviders) => (
  <ThemeProvider attribute="class" enableSystem={false} defaultTheme={theme}>
    {children}
  </ThemeProvider>
);

export default Providers;
