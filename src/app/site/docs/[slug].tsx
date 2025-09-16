import GetStarted from "@/components/pageComponents/docs/get-sarted";
import installation from "@/components/pageComponents/docs/installation";
import DocsFrame from "@/components/pageComponents/site/docsFrame";
import PageContainerWithFooter from "@/components/pageComponents/site/pageContainerWithFooter";

import { useRouter } from "next/router";

const componentMap: Record<string, React.FC> = {
  installation: installation,
  "get-started": GetStarted,
};

export default function Docs() {
  const { slug } = useRouter().query;
  if (!slug || Array.isArray(slug)) return <p>Loading...</p>;

  const DocComponent = componentMap[slug];
  return (
    <div className="">
      <DocsFrame>
        <PageContainerWithFooter>
          <GetStarted />
        </PageContainerWithFooter>
      </DocsFrame>
    </div>
  );
}
