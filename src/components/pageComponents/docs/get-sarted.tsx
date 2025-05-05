import { Info } from "lucide-react";

export default function GetStarted() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">Berto&apos;Studio - Overview</h1>
      <p className="text-gray-300 text-lg mb-8">
        Berto&apos;Studio is a powerful, open-source React component library
        built to help developers ship beautiful, responsive interfaces faster
        than ever. It comes packed with modern components and customization
        options out of the box.
      </p>

      {/* Introduction */}
      <h2 className="text-2xl font-bold mb-2">Introduction</h2>
      <p className="text-gray-300 mb-4">
        Berto&apos;Studio is designed to simplify front-end development by
        offering a curated set of reusable, production-ready UI components
        inspired by modern design trends.
      </p>
      <p className="text-gray-300 mb-6">
        Whether you&apos;re building dashboards, forms, or complete web apps,
        Berto&apos;Studio helps you stay consistent and efficient with built-in
        theming and developer-friendly APIs.
      </p>

      {/* Alert Box */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-start gap-3 mb-10">
        <Info className="text-blue-400 mt-1" size={20} />
        <p className="text-gray-200 text-sm">
          Berto&apos;Studio is actively maintained and evolving. Follow our{" "}
          <a
            href="https://github.com/your-org/bertostudio/issues"
            className="text-blue-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub issues
          </a>{" "}
          page for the latest features, updates, and community contributions.
        </p>
      </div>

      {/* Advantages */}
      <h2 className="text-2xl font-bold mb-4">Why Choose Berto&apos;Studio?</h2>
      <ul className="list-disc list-inside text-gray-300 space-y-4">
        <li>
          <strong>Rapid Development:</strong> Speed up your workflow with a
          large collection of plug-and-play components built for performance and
          usability.
        </li>
        <li>
          <strong>Modern Aesthetics:</strong> Every component in
          Berto&apos;Studio is designed with modern UI principles in mind—clean,
          responsive, and highly polished.
        </li>
        <li>
          <strong>Customizable Themes:</strong> Berto&apos;Studio comes with a
          flexible theming engine so you can match your brand&apos;s style
          effortlessly.
        </li>
        <li>
          <strong>Developer Friendly:</strong> Built with TypeScript and great
          DX in mind—intellisense, typing, and flexible props included.
        </li>
        <li>
          <strong>Community Powered:</strong> Join a growing community of
          developers contributing to and benefiting from Berto&apos;Studio.
          Support is available on{" "}
          <a
            href="https://stackoverflow.com"
            className="text-blue-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stack Overflow
          </a>{" "}
          and GitHub Discussions.
        </li>
      </ul>
    </div>
  );
}
