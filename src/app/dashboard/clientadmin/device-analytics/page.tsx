import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import DeviceAnalyticsClient from "./DeviceAnalyticsClient";

export default async function DeviceAnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <DeviceAnalyticsClient />;
}