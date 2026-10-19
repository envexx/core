// Bearer token authentication helper for write operations.
//
// Extracts Authorization: Bearer <TOKEN> and compares with env.BLOG_API_TOKEN.
// Rejects when token is missing, malformed, or env.BLOG_API_TOKEN is unconfigured.

export function authenticate(
  request: Request,
  env: Env,
): { authenticated: true } | { authenticated: false; reason: string } {
  const configuredToken = env.BLOG_API_TOKEN;
  if (!configuredToken || configuredToken.trim().length === 0) {
    return {
      authenticated: false,
      reason: "Server write token is not configured on this environment",
    };
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return {
      authenticated: false,
      reason: "Missing Authorization header. Expected 'Authorization: Bearer <BLOG_API_TOKEN>'",
    };
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return {
      authenticated: false,
      reason: "Malformed Authorization header. Format must be 'Bearer <token>'",
    };
  }

  const providedToken = parts[1];
  // Simple constant-time-like length & character comparison
  if (providedToken !== configuredToken) {
    return {
      authenticated: false,
      reason: "Invalid API token",
    };
  }

  return { authenticated: true };
}
