import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | WedPlan",
  description:
    "Create a WedPlan account to discover wedding services and manage your booking requests.",
};

const SignupPage = () => {
  return <SignupForm />;
};

export default SignupPage;
