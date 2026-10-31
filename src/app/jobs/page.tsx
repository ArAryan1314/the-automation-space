import { JobsView } from "@/components/views/JobsView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("jobs");

export default function JobsPage() {
  return <JobsView />;
}
