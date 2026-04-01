"use client";

import { usePathname } from "next/navigation";
import GlobalOverlay from "./GlobalOverlay";

export default function ConditionalOverlay() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  
  if (isDashboard) {
    return null;
  }
  
  return <GlobalOverlay />;
}