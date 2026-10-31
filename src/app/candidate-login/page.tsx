import { CandidateLoginView } from "@/components/views/CandidateLoginView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("candidateLogin");

export default function CandidateLoginPage() {
  return <CandidateLoginView />;
}
