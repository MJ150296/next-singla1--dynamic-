import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import TrafficSourcesClient from "./TrafficSourcesClient";

export default async function TrafficSourcesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <TrafficSourcesClient />;
}