import Link from "next/link";

type AuthFallbackCardProps = {
  mode: "sign-in" | "sign-up";
};

export default function AuthFallbackCard({ mode }: AuthFallbackCardProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-semiblack">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {isSignIn ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Auth provider is not configured in this environment. You can continue
        with the local UI flow.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          href="/builder"
          className="block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Continue to Builder
        </Link>

        <Link
          href={isSignIn ? "/agency/sign-up" : "/agency/sign-in"}
          className="block rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          {isSignIn ? "Go to Sign up" : "Go to Sign in"}
        </Link>
      </div>
    </div>
  );
}
