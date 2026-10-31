import { AdminLoginView } from "@/components/views/AdminLoginView";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("adminLogin");

export default function AdminLoginPage() {
  return <AdminLoginView />;
}
