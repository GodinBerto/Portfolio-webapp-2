import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript"; // Import TypeScript syntax
import "prismjs/themes/prism.css"; // Use a minimal theme

const PrismLoader = ({ code }: { code: string }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    Prism.highlightAll(); // Highlight all <code> elements on the page
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      },
      () => alert("Failed to copy the code.")
    );
  };

  return (
    <div className="relative overflow-auto max-w-full">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
      >
        {copySuccess ? "Copied!" : "Copy"}
      </button>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-w-full text-sm sm:text-base lg:text-lg">
        <code className="language-typescript text-gray-700 dark:text-gray-200 break-words">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default PrismLoader;
