import type { Metadata } from "next";
import { PlannerForm } from "@/components/planner-form";

export const metadata: Metadata = {
  title: "Trip Planner",
  description:
    "Use the CheaplyGo trip planner to compare destinations by budget, visa access, travel style, and live fare logic.",
  alternates: {
    canonical: "/planner"
  }
};

export default function PlannerPage() {
  return <PlannerForm />;
}
