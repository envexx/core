/** Join a site origin with an absolute path, avoiding duplicate slashes. */
export function absolute(siteUrl: string, path: string): string {
  const base = (siteUrl || "").replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** Normalize an incoming path/query string to a clean, leading-slash path. */
export function normalizePath(input: string): string {
  let value = (input || "/").trim();
  const queryIndex = value.search(/[?#]/);
  if (queryIndex >= 0) value = value.slice(0, queryIndex);
  if (!value.startsWith("/")) value = `/${value}`;
  if (value.length > 1) value = value.replace(/\/+$/, "");
  return value || "/";
}
