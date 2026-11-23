import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

/**
 * GET /api/auth/token
 *
 * Exchanges a Better Auth session (cookie) for a short-lived JWT that the
 * Express API server can verify with the shared JWT_SECRET.
 *
 * Flow:
 * 1. The browser calls this route after signing in with Better Auth.
 * 2. We verify the Better Auth session cookie server-side.
 * 3. We sign a JWT containing ONLY the user id (never the role — the
 *    server re-reads the role from the database for every request).
 * 4. The client sends the JWT as "Authorization: Bearer <token>" to the
 *    Express API.
 */
export async function GET(request: Request) {
  try {
    // Verify the Better Auth session from the request cookies
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }
    if (session.user.registrationRolePending) {
      return NextResponse.json({ message: "Finish setting up your account first." }, { status: 403 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "JWT_SECRET is not configured." },
        { status: 500 },
      );
    }

    // Sign an HS256 JWT (same algorithm + secret the Express server checks)
    const token = await new SignJWT({ userId: session.user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(secret));

    return NextResponse.json({ token });
  } catch (error) {
    // Next.js uses this request-time signal to stop prerendering this GET route.
    // Let it reach the framework instead of reporting it as a token failure.
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      error.digest === "NEXT_PRERENDER_INTERRUPTED"
    ) {
      throw error;
    }
    console.error("Token generation failed:", error);
    return NextResponse.json(
      { message: "Could not create a token." },
      { status: 500 },
    );
  }
}
