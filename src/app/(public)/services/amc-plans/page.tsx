"use client";

import React from "react";
import { roContent } from "@/app/data/roContent";
import SinglaROSection from "@/app/components/Services/SinglaROsection";

export default function AmcPlansPage() {
  const data = roContent.find((item) => item.slug === "amc-plans");

  if (!data) return <div>Service not found</div>;

  return <SinglaROSection data={[data]} />;
}
