import { TeamView } from "@/components/views/TeamView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("team");

export default function TeamPage() {
  return <TeamView />;
}
