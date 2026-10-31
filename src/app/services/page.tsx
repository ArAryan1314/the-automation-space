import { ServicesView } from "@/components/views/ServicesView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("services");

export default function ServicesPage() {
  return <ServicesView />;
}
