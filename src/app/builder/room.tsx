import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";

export function Room({ children }: { children: ReactNode }) {
  return (
    <ClientSideSuspense fallback={<div>Loading…</div>}>
      {children}
    </ClientSideSuspense>
  );
}
