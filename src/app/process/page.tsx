import { ProcessView } from "@/components/views/ProcessView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("process");

export default function ProcessPage() {
  return <ProcessView />;
}
