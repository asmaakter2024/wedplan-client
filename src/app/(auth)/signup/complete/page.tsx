import type { Metadata } from "next";
import CompleteSignupForm from "@/components/auth/CompleteSignupForm";

export const metadata: Metadata = {
  title: "Finish Account Setup | WedPlan",
  description: "Choose your customer or vendor account type.",
};

export default function CompleteSignupPage() {
  return <CompleteSignupForm />;
}
