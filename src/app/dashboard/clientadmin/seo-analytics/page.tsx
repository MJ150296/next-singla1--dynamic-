import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import SEOAnalyticsClient from "./SEOAnalyticsClient";

export default async function SEOAnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <SEOAnalyticsClient />;
}