// PrismCodeContainer.tsx (or wherever your code block lives)

"use client";

import React from "react";

const PrismCodeContainer = ({ code }: { code: string }) => {
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
