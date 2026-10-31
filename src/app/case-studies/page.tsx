import { CaseStudiesView } from "@/components/views/CaseStudiesView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("caseStudies");

export default function CaseStudiesPage() {
  return <CaseStudiesView />;
}
