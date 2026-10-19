import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidHttpUrl,
  isValidIsoDate,
  validateArticlePayload,
  validateImageUpload,
} from "../src/validation";
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

test("isValidHttpUrl accepts http and https and rejects others", () => {
  assert.equal(isValidHttpUrl("https://example.com"), true);
  assert.equal(isValidHttpUrl("http://example.com/path?query=1"), true);
  assert.equal(isValidHttpUrl("ftp://example.com"), false);
  assert.equal(isValidHttpUrl("not-a-url"), false);
  assert.equal(isValidHttpUrl(""), false);
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

const validBaseArticle = {
  slug: "test-article",
  category: "AI Systems",
  readTime: 5,
  date: "2026-10-19",
  title: { id: "Judul Uji", en: "Test Title" },
  excerpt: { id: "Ringkasan uji", en: "Test excerpt" },
  takeaway: { id: "Takeaway uji", en: "Test takeaway" },
  service: "ai-agent-systems",
  sections: [
    {
      heading: { id: "Bagian 1", en: "Section 1" },
      paragraphs: [{ id: "Paragraf 1", en: "Paragraph 1" }],
    },
  ],
};

test("validateArticlePayload handles sources: undefined, valid sources, empty sources", () => {
  // 1. undefined sources is valid
  const resUndefined = validateArticlePayload(validBaseArticle);
  assert.equal(resUndefined.success, true);
  if (resUndefined.success) {
    assert.equal(resUndefined.data.sources, undefined);
  }

  // 2. valid sources with full fields
  const resValid = validateArticlePayload({
    ...validBaseArticle,
    sources: [
      {
        title: "Reuters AI Report",
        url: "https://www.reuters.com/technology/ai-report",
        publisher: "Reuters",
        date: "2026-10-15",
      },
      {
        title: "TechCrunch Automation",
        url: "https://techcrunch.com/automation",
      },
    ],
  });
  assert.equal(resValid.success, true);
  if (resValid.success) {
    assert.equal(resValid.data.sources?.length, 2);
    assert.equal(resValid.data.sources?.[0].title, "Reuters AI Report");
    assert.equal(resValid.data.sources?.[0].publisher, "Reuters");
    assert.equal(resValid.data.sources?.[0].date, "2026-10-15");
    assert.equal(resValid.data.sources?.[1].publisher, undefined);
  }
});

test("validateArticlePayload rejects invalid sources: empty title, invalid url, invalid date, more than 10", () => {
  // Empty title
  const resEmptyTitle = validateArticlePayload({
    ...validBaseArticle,
    sources: [{ title: "   ", url: "https://example.com" }],
  });
  assert.equal(resEmptyTitle.success, false);
  if (!resEmptyTitle.success) {
    assert.ok(resEmptyTitle.errors.some((e) => e.includes("title must be a non-empty string")));
  }

  // Invalid URL (ftp or plain string)
  const resBadUrl = validateArticlePayload({
    ...validBaseArticle,
    sources: [{ title: "Valid Title", url: "not-a-valid-http-url" }],
  });
  assert.equal(resBadUrl.success, false);
  if (!resBadUrl.success) {
    assert.ok(resBadUrl.errors.some((e) => e.includes("url must be a valid http or https URL")));
  }

  // Invalid date
  const resBadDate = validateArticlePayload({
    ...validBaseArticle,
    sources: [{ title: "Valid Title", url: "https://example.com", date: "2026-02-31" }],
  });
  assert.equal(resBadDate.success, false);
  if (!resBadDate.success) {
    assert.ok(resBadDate.errors.some((e) => e.includes("date must be a valid ISO 8601 calendar date")));
  }

  // Exceeding 10 items
  const elevenSources = Array.from({ length: 11 }, (_, i) => ({
    title: `Source ${i + 1}`,
    url: `https://example.com/source-${i + 1}`,
  }));
  const resOver10 = validateArticlePayload({
    ...validBaseArticle,
    sources: elevenSources,
  });
  assert.equal(resOver10.success, false);
  if (!resOver10.success) {
    assert.ok(resOver10.errors.some((e) => e.includes("cannot exceed 10 items")));
  }
});
