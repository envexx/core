import test from "node:test";
import assert from "node:assert/strict";
import { isValidIsoDate, validateImageUpload } from "../src/validation";
import { authenticate } from "../src/auth";
import { isAllowedUploadKey } from "../src/index";

test("isValidIsoDate rejects invalid calendar roll-overs and accepts valid calendar dates", () => {
  // Invalid calendar dates that Date.parse would roll over
  assert.equal(isValidIsoDate("2026-02-31"), false, "2026-02-31 must be invalid");
  assert.equal(isValidIsoDate("2026-04-31"), false, "2026-04-31 must be invalid");
  assert.equal(isValidIsoDate("2026-02-29"), false, "2026-02-29 is not a leap year");
  assert.equal(isValidIsoDate("2025-11-31"), false, "November has only 30 days");

  // Valid dates (including leap year and year-end)
  assert.equal(isValidIsoDate("2024-02-29"), true, "2024 is a leap year");
  assert.equal(isValidIsoDate("2026-12-31"), true, "2026-12-31 must be valid");
  assert.equal(isValidIsoDate("2026-10-19"), true, "2026-10-19 must be valid");

  // Malformed format
  assert.equal(isValidIsoDate(""), false);
  assert.equal(isValidIsoDate("2026-1-1"), false);
  assert.equal(isValidIsoDate("invalid-date"), false);
});

test("authenticate handles missing, malformed, and valid tokens correctly", () => {
  const env: Env = { BLOG_API_TOKEN: "secret-token-123" };

  // Missing Authorization header
  const reqNoAuth = new Request("https://coresolution.digital/api/blog", {
    method: "POST",
  });
  const resNoAuth = authenticate(reqNoAuth, env);
  assert.equal(resNoAuth.authenticated, false);

  // Wrong token
  const reqWrongToken = new Request("https://coresolution.digital/api/blog", {
    method: "POST",
    headers: { Authorization: "Bearer wrong-token" },
  });
  const resWrongToken = authenticate(reqWrongToken, env);
  assert.equal(resWrongToken.authenticated, false);

  // Correct token
  const reqCorrect = new Request("https://coresolution.digital/api/blog", {
    method: "POST",
    headers: { Authorization: "Bearer secret-token-123" },
  });
  const resCorrect = authenticate(reqCorrect, env);
  assert.equal(resCorrect.authenticated, true);

  // Unconfigured server token
  const resUnset = authenticate(reqCorrect, {});
  assert.equal(resUnset.authenticated, false);
});

test("validateImageUpload enforces 5 MB size limit and MIME whitelist", () => {
  // Empty file
  assert.equal(validateImageUpload(0, "image/png").valid, false);

  // Exceeds 5 MB
  const overSize = 5 * 1024 * 1024 + 1;
  assert.equal(validateImageUpload(overSize, "image/png").valid, false);

  // Allowed MIME within 5 MB
  const validSize = 2 * 1024 * 1024;
  assert.equal(validateImageUpload(validSize, "image/png").valid, true);
  assert.equal(validateImageUpload(validSize, "image/jpeg").valid, true);
  assert.equal(validateImageUpload(validSize, "image/webp").valid, true);
  assert.equal(validateImageUpload(validSize, "image/webp; charset=binary").valid, true);

  // Disallowed MIME types
  assert.equal(validateImageUpload(validSize, "image/gif").valid, false);
  assert.equal(validateImageUpload(validSize, "application/pdf").valid, false);
  assert.equal(validateImageUpload(validSize, "text/plain").valid, false);
  assert.equal(validateImageUpload(validSize, null).valid, false);
});

test("isAllowedUploadKey only allows images/ prefix and rejects articles/ or root access", () => {
  // Publicly allowed
  assert.equal(isAllowedUploadKey("images/sample.png"), true);
  assert.equal(isAllowedUploadKey("images/slug/hero.webp"), true);

  // Restricted
  assert.equal(isAllowedUploadKey("articles/test.json"), false);
  assert.equal(isAllowedUploadKey("articles/index.json"), false);
  assert.equal(isAllowedUploadKey("secrets.txt"), false);
  assert.equal(isAllowedUploadKey(""), false);
});
