import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/firebase/server-auth";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/landing-page",
  "/login-page",
  "/registration-page",
];

// Define protected routes that require authentication
const protectedRoutes = ["/protected"];

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking attacks
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy for privacy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (basic - customize as needed)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a public route, allow access with security headers
  if (isPublicRoute) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const authenticated = await isAuthenticated(request);

    if (!authenticated) {
      // Not authenticated, redirect to login
      const clientIp =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      console.warn(
        `[AUTH] Unauthorized access attempt to: ${pathname} from IP: ${clientIp}`
      );

      const loginUrl = new URL("/login-page", request.url);
      // Add return URL so user can be redirected back after login
      loginUrl.searchParams.set("returnUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, allow access with security headers
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // For all other routes, allow access by default with security headers
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
