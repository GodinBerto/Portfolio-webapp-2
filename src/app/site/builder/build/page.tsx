import Link from "next/link";
import {
  Layers,
  MousePointer2,
  Pencil,
  Shapes,
  Type,
  Undo2,
} from "lucide-react";

const features = [
  {
    title: "Shape Tools",
    description: "Rectangle, circle, triangle, and line creation with drag-to-size.",
    icon: Shapes,
  },
  {
    title: "Text + Free Draw",
    description: "Add editable text blocks and sketch with the pencil tool.",
    icon: Pencil,
  },
  {
    title: "Layer Dashboard",
    description: "Inspect all elements, select by layer, and manage order/properties.",
    icon: Layers,
  },
  {
    title: "Undo / Redo",
    description: "Full canvas history tracking with toolbar and sidebar controls.",
    icon: Undo2,
  },
];

export default function Build() {
  return (
    <main className="mx-auto my-20 max-w-6xl px-6">
      <section className="mb-10">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <MousePointer2 size={14} />
          Builder Dashboard
        </p>
        <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Canvas Builder Is Ready
        </h1>
        <p className="max-w-2xl text-gray-600 dark:text-gray-300">
          Start drawing, editing, and organizing components with the full toolset.
        </p>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#111111]"
            >
              <div className="mb-2 inline-flex rounded-md bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                <Icon size={16} />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {feature.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/builder"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Open Builder
        </Link>
        <Link
          href="/site/builder"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Back to Builder Info
        </Link>
      </div>
    </main>
  );
}
