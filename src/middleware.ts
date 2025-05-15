import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {verifyToken} from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Handle root admin path
    if (request.nextUrl.pathname === "/admin" || request.nextUrl.pathname === "/admin/") {
      const token = request.cookies.get("jwt")?.value;
      if (token) {
        const payload = await verifyToken(token);

        if (payload) {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
          // If user is logged in, redirect to dashboard
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else {
          // If user is not logged in, redirect to login
          return NextResponse.redirect(new URL("/admin/login", request.url));
        }
      }
    }

    // Skip middleware for login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If user is already logged in, redirect to dashboard
      const token = request.cookies.get("jwt")?.value;
      if (token) {
        try {
          const payload = await verifyToken(token);
          if (payload) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
          }
        } catch (error) {
          // Invalid token, continue to login page
        }
      }
      return NextResponse.next();
    }

    try {
      // Check JWT token
      const token = request.cookies.get("jwt")?.value;
      if (!token) {
        console.log("No token");
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("jwt");
        response.cookies.delete("x-user-id");
        response.cookies.delete("x-user-role");
        response.cookies.delete("x-user-name");
        return response;
      }

      // Verify JWT token
      const payload = await verifyToken(token);
      if (!payload) {
        console.log("Invalid token", payload);
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("jwt");
        response.cookies.delete("x-user-id");
        response.cookies.delete("x-user-role");
        response.cookies.delete("x-user-name");
        return response;
      }

      // Create response with user info in both headers and cookies
      const response = NextResponse.next();

      // Set headers
      response.headers.set("x-user-id", payload.userId);
      response.headers.set("x-user-role", payload.role);
      response.headers.set("x-user-name", payload.username);

      // Set cookies with same data and proper configuration
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
      };

      response.cookies.set("x-user-id", payload.userId, cookieOptions);
      response.cookies.set("x-user-role", payload.role, cookieOptions);
      response.cookies.set("x-user-name", payload.username, cookieOptions);

      return response;
    } catch (error) {
      console.error("Middleware error:", error);
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("jwt");
      response.cookies.delete("x-user-id");
      response.cookies.delete("x-user-role");
      response.cookies.delete("x-user-name");
      return response;
    }
  }

  // For API routes
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    // Skip middleware for login route
    if (request.nextUrl.pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    try {
      const token = request.cookies.get("jwt")?.value;
      if (!token) {
        return NextResponse.json({error: "Unauthorized - No token provided"}, {status: 401});
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({error: "Unauthorized - Invalid or expired token"}, {status: 401});
      }

      // Create response with user info in both headers and cookies
      const response = NextResponse.next();

      // Set headers
      response.headers.set("x-user-id", payload.userId);
      response.headers.set("x-user-role", payload.role);
      response.headers.set("x-user-name", payload.username);

      return response;
    } catch (error) {
      console.error("API middleware error:", error);
      return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
