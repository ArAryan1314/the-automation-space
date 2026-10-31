import { ContactView } from "@/components/views/ContactView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return <ContactView />;
}
