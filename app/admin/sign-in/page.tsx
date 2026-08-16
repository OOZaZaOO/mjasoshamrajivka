import { AdminSignIn } from "@/components/admin/admin-sign-in";

export default async function AdminSignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <AdminSignIn configurationError={params.error === "configuration"} />;
}
