import { PortalView } from "@/components/views/PortalView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("portal");

export default function AgencyPortal() {
  return <PortalView />;
}
