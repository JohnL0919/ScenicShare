import { NextRequest } from "next/server";

/**
 * Server-side authentication utilities for Firebase Auth
 */

interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  exp: number;
  iat: number;
}

/**
 * Extracts the Firebase Auth token from the request cookies
 */
export function getAuthToken(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get("__session");
  return sessionCookie?.value || null;
}

/**
 * Validates a Firebase Auth JWT token
 *
 * ⚠️ PRODUCTION WARNING: This is a development-grade validation
 * For production, you MUST use Firebase Admin SDK to verify signatures:
 *
 * import { getAuth } from 'firebase-admin/auth';
 * const decodedToken = await getAuth().verifyIdToken(token);
 *
 * Current implementation does NOT verify cryptographic signature!
 */
export async function validateAuthToken(
  token: string
): Promise<DecodedToken | null> {
  try {
    // Basic JWT structure validation
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid JWT structure: Expected 3 parts");
      return null;
    }

    // Decode the header (first part of JWT)
    const header = JSON.parse(atob(parts[0]));

    // Verify it's a JWT token
    if (header.typ !== "JWT") {
      console.warn("Invalid token type:", header.typ);
      return null;
    }

    // Decode the payload (second part of JWT)
    const payload = JSON.parse(atob(parts[1]));

    // Validate required Firebase Auth fields
    if (!payload.user_id && !payload.sub && !payload.uid) {
      console.warn("Token missing user identifier");
      return null;
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.warn("Token expired");
      return null;
    }

    // Check if token is issued in the future (clock skew attack)
    if (payload.iat && payload.iat > currentTime + 300) {
      console.warn("Token issued in the future");
      return null;
    }

    // Verify token is from Firebase (check issuer)
    if (payload.iss && !payload.iss.includes("securetoken.google.com")) {
      console.warn("Invalid token issuer:", payload.iss);
      return null;
    }

    // Verify audience matches Firebase project
    // Note: In production, you should validate this against your actual project ID
    if (payload.aud && payload.firebase?.sign_in_provider === undefined) {
      // Additional Firebase-specific validation could go here
    }

    // Return decoded token info
    return {
      uid: payload.sub || payload.uid || payload.user_id,
      email: payload.email,
      email_verified: payload.email_verified,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * Checks if the user is authenticated based on the request
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = getAuthToken(request);
  if (!token) {
    return false;
  }

  const decodedToken = await validateAuthToken(token);
  return decodedToken !== null;
}

/**
 * Gets the current user information from the request
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<DecodedToken | null> {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  return await validateAuthToken(token);
}

/**
 * Middleware helper to protect routes
 */
export async function requireAuth(
  request: NextRequest
): Promise<DecodedToken | null> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
