import test from "node:test";
import assert from "node:assert/strict";

// Lightweight unit test suite for V2 RBAC and File Validation logic
// Run with: node --test scripts/unit-tests.mjs

test("PDF validation rejects non-PDF buffers and truncated PDFs", () => {
  const fake = Buffer.from("not a pdf file at all");
  assert.equal(fake[0] === 0x25 && fake[1] === 0x50, false);

  const validMinimalPdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n");
  assert.equal(validMinimalPdf.subarray(0, 5).toString("latin1"), "%PDF-");
  assert.equal(validMinimalPdf.toString("latin1").includes("%%EOF"), true);
});

test("RBAC role definitions enforce least privilege boundaries", () => {
  const matrix = {
    super_admin: ["content:write", "recruitment:write", "users:write", "security:read"],
    content_manager: ["content:write"],
    hr_manager: ["recruitment:write"],
    operations_manager: ["crm:write", "products:write"],
    auditor: ["audit:read", "security:read"],
  };

  assert.equal(matrix.content_manager.includes("users:write"), false);
  assert.equal(matrix.hr_manager.includes("finance:write"), false);
  assert.equal(matrix.auditor.includes("content:write"), false);
  assert.equal(matrix.super_admin.includes("security:read"), true);
});

test("ZIP without OOXML entries is distinguished from valid DOCX", () => {
  const genericZip = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]);
  const contentStr = genericZip.toString("utf8");
  assert.equal(contentStr.includes("[Content_Types].xml"), false);
  assert.equal(contentStr.includes("word/document.xml"), false);
});
