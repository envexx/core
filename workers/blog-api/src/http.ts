// HTTP helpers: baseline security headers, CORS allow-listing, and response builders.

export function baseHeaders(): Headers {
  const headers = new Headers();
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  return headers;
}

function normalizeOrigin(origin: string): string {
  return (origin || "").trim().replace(/\/+$/, "").toLowerCase();
}

/** Origins allowed to call the API: CORS_ORIGINS plus the canonical SITE_URL. */
export function allowedOrigins(env: Env, siteUrl: string): string[] {
  const configured = (env.CORS_ORIGINS || "")
    .split(/[,\s]+/)
    .map(normalizeOrigin)
    .filter(Boolean);
  const values = siteUrl ? configured.concat(normalizeOrigin(siteUrl)) : configured;
  return Array.from(new Set(values));
}

/** Echo the request Origin only when it is explicitly allow-listed. Never "*". */
export function applyCors(request: Request, env: Env, siteUrl: string, headers: Headers): void {
  const origin = request.headers.get("Origin");
  if (!origin) return;
  if (!allowedOrigins(env, siteUrl).includes(normalizeOrigin(origin))) return;

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  headers.set("Access-Control-Max-Age", "86400");
  const vary = headers.get("Vary");
  headers.set("Vary", vary ? `${vary}, Origin` : "Origin");
}

function withExtras(headers: Headers, extra?: Record<string, string>): Headers {
  if (extra) {
    for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  }
  return headers;
}

export function jsonResponse(
  data: unknown,
  status: number,
  request: Request,
  env: Env,
  siteUrl: string,
  extra?: Record<string, string>,
): Response {
  const headers = withExtras(baseHeaders(), extra);
  headers.set("Content-Type", "application/json; charset=utf-8");
  applyCors(request, env, siteUrl, headers);
  return new Response(`${JSON.stringify(data, null, 2)}\n`, { status, headers });
}

export function textResponse(
  body: string,
  status: number,
  contentType: string,
  request: Request,
  env: Env,
  siteUrl: string,
  extra?: Record<string, string>,
): Response {
  const headers = withExtras(baseHeaders(), extra);
  headers.set("Content-Type", contentType);
  applyCors(request, env, siteUrl, headers);
  return new Response(body, { status, headers });
}

export function preflightResponse(request: Request, env: Env, siteUrl: string): Response {
  const headers = baseHeaders();
  applyCors(request, env, siteUrl, headers);
  return new Response(null, { status: 204, headers });
}
