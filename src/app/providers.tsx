"use client";

import { DarkModeProvider } from "./context/darkModeContext";
import PageContainer from "./pageComponents/pageContainer";

const Providers = ({ children }: _IChildren) => (
  <DarkModeProvider>
    <PageContainer>{children}</PageContainer>
  </DarkModeProvider>
);

export default Providers;
