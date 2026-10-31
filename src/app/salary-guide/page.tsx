import { SalaryGuideView } from "@/components/views/SalaryGuideView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("salaryGuide");

export default function SalaryGuidePage() {
  return <SalaryGuideView />;
}
