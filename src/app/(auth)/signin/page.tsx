import type { Metadata } from "next";
import SigninForm from "@/components/auth/SigninForm";

export const metadata: Metadata = {
  title: "Sign In | WedPlan",
  description:
    "Sign in to your WedPlan account to discover wedding services and manage your bookings.",
};

const SigninPage = () => {
  return <SigninForm />;
};

export default SigninPage;
