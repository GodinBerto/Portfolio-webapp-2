import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";
import { Copy, Check } from "lucide-react";

const PrismLoader = ({ code }: { code: string }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

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
                 bg-gray-700/50 hover:bg-gray-600 transition-all duration-200
                 text-gray-300 hover:text-white
                 opacity-0 group-hover:opacity-100 focus:opacity-100
                 backdrop-blur-sm"
        aria-label={copySuccess ? "Copied!" : "Copy code"}
      >
        {copySuccess ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      <pre className="!bg-gray-900/95 !p-4 rounded-lg overflow-hidden
                    border border-gray-700/50 backdrop-blur-sm
                    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <code className="language-tsx text-sm font-mono">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default PrismLoader;
