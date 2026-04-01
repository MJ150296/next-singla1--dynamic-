import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import GeographicDataClient from "./GeographicDataClient";

export default async function GeographicDataPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <GeographicDataClient />;
}