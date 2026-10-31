import { AboutView } from "@/components/views/AboutView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return <AboutView />;
}
