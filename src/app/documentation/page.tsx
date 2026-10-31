import { DocumentationView } from "@/components/views/DocumentationView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("documentation");

export default function DocumentationPage() {
  return <DocumentationView />;
}
