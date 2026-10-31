import { HomeView } from "@/components/views/HomeView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("home");

export default function HomePage() {
  return <HomeView />;
}
