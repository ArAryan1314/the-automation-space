import { EmployersView } from "@/components/views/EmployersView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("employers");

export default function EmployersPage() {
  return <EmployersView />;
}
