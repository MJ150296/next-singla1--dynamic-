import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import TrafficMetricsClient from "./TrafficMetricsClient";

export default async function TrafficMetricsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <TrafficMetricsClient />;
}
