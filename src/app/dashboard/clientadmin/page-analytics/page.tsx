import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import PageAnalyticsClient from "./PageAnalyticsClient";

export default async function PageAnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <PageAnalyticsClient />;
}