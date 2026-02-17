import BuilderEditorPage from "@/components/pageComponents/builder/editorPage";

export default async function BuilderProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  return <BuilderEditorPage projectId={resolvedParams.projectId} />;
}
