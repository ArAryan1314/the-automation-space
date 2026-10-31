import { CandidatesView } from "@/components/views/CandidatesView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("candidates");

export default function CandidatesPage() {
  return <CandidatesView />;
}
