import { FAQView } from "@/components/views/FAQView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("faq");

export default function FAQPage() {
  return <FAQView />;
}
