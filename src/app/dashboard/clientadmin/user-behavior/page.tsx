import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import UserBehaviorClient from "./UserBehaviorClient";

export default async function UserBehaviorPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ClientAdmin") {
    redirect("/dashboard");
  }

  return <UserBehaviorClient />;
}