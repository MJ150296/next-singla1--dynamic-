import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import PerformanceMetricsClient from "./PerformanceMetricsClient";

export default async function PerformanceMetricsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <PerformanceMetricsClient />;
}