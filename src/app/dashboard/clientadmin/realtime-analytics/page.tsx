import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import RealtimeAnalyticsClient from "./RealtimeAnalyticsClient";

export default async function RealtimeAnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <RealtimeAnalyticsClient />;
}