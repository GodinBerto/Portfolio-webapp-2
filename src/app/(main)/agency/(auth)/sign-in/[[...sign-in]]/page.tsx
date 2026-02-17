import { SignIn } from "@clerk/nextjs";
import AuthFallbackCard from "@/components/pageComponents/auth/authFallbackCard";

const hasClerkEnv = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default function Page() {
  if (!hasClerkEnv) {
    return <AuthFallbackCard mode="sign-in" />;
  }

  return (
    <SignIn
      appearance={{
        elements: {
          card: {
            backgroundColor: "#0d1117", // or any color you want
            color: "#fff", // text color
            border: "1px solid #fff", // border color
            borderRadius: "8px", // border radius
          },
        },
      }}
    />
  );
}
