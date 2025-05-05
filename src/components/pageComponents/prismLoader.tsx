"use client";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";

const PrismCodeContainer = dynamic(() => import("./prismCodeContainer"), {
  ssr: false,
});
const PrismLoader = ({ code }: { code: string }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md 
           bg-gray-800 hover:bg-gray-700 transition-all duration-200
           text-white
           opacity-0 group-hover:opacity-100 focus:opacity-100
           shadow-md"
        aria-label={copySuccess ? "Copied!" : "Copy code"}
      >
        {copySuccess ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <PrismCodeContainer code={code} />
    </div>
  );
};

export default PrismLoader;
