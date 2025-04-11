"use client";

import { DarkModeProvider } from "../context/darkModeContext";
import PageContainer from "../components/pageComponents/pageContainer";
import { ThemeProvider } from "@/context/themes.context";
interface _IProviders {
  children: React.ReactNode;
  theme: string;
}

const Providers = ({ children, theme }: _IProviders) => (
  <ThemeProvider attribute="class" enableSystem={false} defaultTheme={theme}>
    <PageContainer>{children}</PageContainer>
  </ThemeProvider>
);

export default Providers;
