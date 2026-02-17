import Link from "next/link";
import { notFound } from "next/navigation";
import DocsFrame from "@/components/pageComponents/site/docsFrame";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";
import {
  DocsContentBlock,
  docsOrder,
  getDocBySlug,
  getDocNavigation,
} from "../data";

const renderBlock = (block: DocsContentBlock, index: number) => {
  if (block.type === "paragraph") {
    return (
      <p key={index} className="text-base leading-7 text-gray-300">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ol key={index} className="list-decimal space-y-2 pl-6 text-gray-300">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  if (block.type === "code") {
    return (
      <pre
        key={index}
        className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-200"
      >
        {block.code}
      </pre>
    );
  }

  return (
    <table
      key={index}
      className="w-full overflow-hidden rounded-lg border border-gray-700 text-left"
    >
      <thead className="bg-gray-900">
        <tr>
          <th className="px-4 py-2 text-sm font-semibold">{block.headers[0]}</th>
          <th className="px-4 py-2 text-sm font-semibold">{block.headers[1]}</th>
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row) => (
          <tr key={`${row.key}-${row.value}`} className="border-t border-gray-700">
            <td className="px-4 py-2 text-sm text-gray-200">{row.key}</td>
            <td className="px-4 py-2 text-sm text-gray-300">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function DocsSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const doc = getDocBySlug(params.slug);
  if (!doc) {
    notFound();
  }

  const { previous, next } = getDocNavigation(doc.slug);
  const fallbackNext = docsOrder[0];

  return (
    <DocsFrame currentSlug={doc.slug}>
      <PageContainerWithFooter fullWidth={true}>
        <article className="mx-auto max-w-4xl px-6 py-12 text-white">
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
            {doc.sectionName}
          </p>
          <h1 className="mb-2 text-4xl font-bold">{doc.name}</h1>
          <p className="mb-10 text-lg text-gray-300">{doc.description}</p>

          <div className="space-y-6">
            {doc.blocks.map((block, index) => renderBlock(block, index))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-gray-700 pt-6">
            {previous ? (
              <Link
                href={`/site/docs/${previous.slug}`}
                className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800"
              >
                Previous: {previous.name}
              </Link>
            ) : (
              <span />
            )}

            <Link
              href={`/site/docs/${next?.slug ?? fallbackNext.slug}`}
              className="rounded-md border border-blue-500 bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-500"
            >
              Next: {next?.name ?? fallbackNext.name}
            </Link>
          </div>
        </article>
      </PageContainerWithFooter>
    </DocsFrame>
  );
}
