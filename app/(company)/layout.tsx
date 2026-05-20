
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-server-client";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { error, data } = await getSession()

  if (error || !data) {
    return redirect("/sign-in");
  }

  return <>{children}</>;
}

