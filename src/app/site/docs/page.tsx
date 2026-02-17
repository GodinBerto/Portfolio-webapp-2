import { redirect } from "next/navigation";
import { docsOrder } from "./data";

export default function DocsPage() {
  const firstDoc = docsOrder[0];
  redirect(`/site/docs/${firstDoc?.slug ?? "introduction"}`);
}
