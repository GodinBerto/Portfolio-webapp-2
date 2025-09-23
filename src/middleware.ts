import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/site(.*)",
  "/agency/sign-in(.*)",
  "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Redirect root "/" → "/site/home"
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/site/home";
    return NextResponse.redirect(url);
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) await auth.protect(); // ✅ correct usage

  return NextResponse.next();
});

// Clerk’s recommended matcher: skip _next & static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)", // always run for API routes
  ],
};
