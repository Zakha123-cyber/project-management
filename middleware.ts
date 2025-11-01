import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/clerk", "/api/test-member"],
  afterAuth(auth, req) {
    let path = "/select-org";

    if (auth.orgId) {
      path = `/organization/${auth.orgId}`;
    }

    const orgSelection = new URL(path, req.url);

    if (auth.userId && auth.isPublicRoute) {
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      return NextResponse.redirect(new URL("/select-org", req.url));
    }
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Always run for root
    "/",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
