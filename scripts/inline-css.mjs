// Inline the built stylesheet into every prerendered page: one less render-blocking round trip.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "dist/public";

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? pages(path) : path.endsWith(".html") ? [path] : [];
  });
}

let inlined = 0;
for (const file of pages(root)) {
  const html = readFileSync(file, "utf8");
  const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
  if (!link) continue;
  const css = readFileSync(join(root, link[1].slice(1)), "utf8");
  writeFileSync(file, html.replace(link[0], `<style>${css}</style>`));
  inlined += 1;
}

console.log(`inline-css: ${inlined} pages`);
