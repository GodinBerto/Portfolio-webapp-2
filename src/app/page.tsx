"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/pages/mainPage");
  }, [router]); // Run once when the component mounts

  return null;
}
