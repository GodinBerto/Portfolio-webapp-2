import { SignUp } from "@clerk/nextjs";
import AuthFallbackCard from "@/components/pageComponents/auth/authFallbackCard";

const hasClerkEnv = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default function Page() {
  if (!hasClerkEnv) {
    return <AuthFallbackCard mode="sign-up" />;
  }

  return <SignUp />;
}
