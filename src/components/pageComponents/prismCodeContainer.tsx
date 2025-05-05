// PrismCodeContainer.tsx (or wherever your code block lives)

"use client";

import Prism from "prismjs";
import React, { useEffect } from "react";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";

const PrismCodeContainer = ({ code }: { code: string }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre
      className="bg-gray-900/95 !p-4 rounded-lg overflow-hidden
                 border border-gray-700/50 backdrop-blur-sm
                 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
      <code className="language-tsx text-sm font-mono">{code}</code>
    </pre>
  );
};

export default PrismCodeContainer;
