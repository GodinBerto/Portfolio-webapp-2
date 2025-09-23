import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/site(.*)",
  "/agency/sign-in(.*)",
  "/api/uploadthing",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // Redirect root "/" → "/site/home"
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/site/home";
    return NextResponse.redirect(url);
  }

  // ✅ No manual protect() call needed
  // Clerk will handle protecting non-public routes automatically
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

// ✅ Simplified matcher (Clerk’s official recommendation)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/(api|trpc)(.*)"],
};
