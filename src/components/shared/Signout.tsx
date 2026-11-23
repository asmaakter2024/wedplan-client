"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

const SignoutCompo = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      clearToken();
      router.push("/signin");
      router.refresh();
    } catch {
      clearToken();
    }
  };
  return (
    <button
      type="submit"
      className="w-full text-left"
      onClick={() => handleSignOut()}
    >
      Sign out
    </button>
  );
};

export default SignoutCompo;
