import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminAssortmentLayout({ children }: { children: React.ReactNode }) {
  if (!await hasAdminSession()) redirect("/admin/sign-in");
  return children;
}
