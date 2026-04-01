import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Role-based routing
  if (session.user.role === "SuperAdmin") {
    redirect("/dashboard/superadmin");
  } else if (session.user.role === "ClientAdmin") {
    redirect("/dashboard/clientadmin");
  }

  // Fallback
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard.</p>
    </div>
  );
}