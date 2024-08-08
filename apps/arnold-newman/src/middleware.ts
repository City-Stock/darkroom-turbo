// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";

// Config
// ========================================================
const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env?.ALLOWED_METHODS || "").split(","),
  allowedOrigins: (process.env?.ALLOWED_ORIGIN || "").split(","),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || "").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || "").split(","),
  maxAge: process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE) || undefined,
  credentials: process.env?.CREDENTIALS == "true",
};

// Middleware
// ========================================================
export async function middleware(request: NextRequest) {
  // Response
  const response = NextResponse.next();
  // Allowed origins check
  const origin = request.headers.get('origin') ?? '';

  if (corsOptions.allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (origin && corsOptions.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // If not allowed, return a 403 Forbidden response
    return new Response('Forbidden', { status: 403 });
  }

  // Check if it's a preflight request
  if (request.method === 'OPTIONS') {
    // Preflight request. Reply successfully:
    const preFlightResponse = new Response(null, { status: 200 });

    preFlightResponse.headers.set('Access-Control-Allow-Origin', origin);
    preFlightResponse.headers.set('Access-Control-Allow-Methods', corsOptions.allowedMethods.join(','));
    preFlightResponse.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    preFlightResponse.headers.set('Access-Control-Max-Age', corsOptions.maxAge?.toString() ?? '');
    preFlightResponse.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
    preFlightResponse.headers.set('Access-Control-Allow-Credentials', corsOptions.credentials.toString());

    return preFlightResponse;
  }

  // Set default CORS headers
  response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
  response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
  response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
  response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");

  // Return
  return response;
}

// Matching Paths
// ========================================================
export const config = {
  matcher: "/api/:path*",
};
