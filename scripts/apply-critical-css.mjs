// Inline the above-the-fold CSS and load the full stylesheet off the render path.
// The manifest is generated on a dev machine (r1-critical/generate.mjs); if the
// built stylesheet no longer matches it, leave the page untouched.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "dist/public";
const manifest = JSON.parse(readFileSync("client/critical-css.json", "utf8"));
const LINK = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/;
const TRIPLE = /<style data-critical>[\s\S]*?<\/style><link rel="preload" as="style" href="([^"]+)" onload="this\.rel='stylesheet'"><noscript><link rel="stylesheet" href="[^"]+"><\/noscript>/;

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? pages(path) : path.endsWith(".html") ? [path] : [];
  });
}

const routeOf = (file) => {
  const rel = file.slice(root.length).replace(/\\/g, "/");
  return rel === "/index.html" ? "/" : rel.replace(/\/index.html$/, "");
};

let inlined = 0;
const skipped = [];
for (const file of pages(root)) {
  // Re-running the step must not stack critical sheets.
  const html = readFileSync(file, "utf8").replace(TRIPLE, '<link rel="stylesheet" href="$1">');
  const link = html.match(LINK);
  if (!link) continue;
  if (link[1] !== manifest.cssFile) {
    skipped.push(`${routeOf(file)} (stylesheet ${link[1]} != ${manifest.cssFile})`);
    continue;
  }
  const css = readFileSync(join(root, link[1].slice(1)));
  if (createHash("sha256").update(css).digest("hex").slice(0, 16) !== manifest.cssHash) {
    skipped.push(`${routeOf(file)} (stylesheet content changed)`);
    continue;
  }
  const sheet = manifest.routes[routeOf(file)];
  if (!sheet) {
    skipped.push(`${routeOf(file)} (no critical sheet)`);
    continue;
  }
  const critical = manifest.sheets[sheet];
  const replacement =
    `<style data-critical>${critical}</style>` +
    `<link rel="preload" as="style" href="${link[1]}" onload="this.rel='stylesheet'">` +
    `<noscript><link rel="stylesheet" href="${link[1]}"></noscript>`;
  writeFileSync(file, html.replace(link[0], replacement));
  inlined += 1;
}

console.log(`critical-css: ${inlined} pages inlined, ${skipped.length} left blocking`);
for (const item of skipped) console.warn(`  skipped ${item}`);
