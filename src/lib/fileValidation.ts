/**
 * Hardened resume file validation (PDF & DOCX).
 *
 * A ZIP signature (PK\x03\x04) alone does NOT establish that a file is a
 * valid DOCX document. This module verifies:
 *   1. File size limit (4 MB)
 *   2. PDF magic header (%PDF-) and basic EOF/structure sanity
 *   3. DOCX ZIP header + presence of required OOXML entries
 *      ([Content_Types].xml and word/document.xml) in the ZIP central directory
 *      and rejection of suspiciously high archive entry counts (zip-bomb guard).
 */

export const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 250;

export type ValidatedResume =
  | { valid: true; ext: "pdf" | "docx"; mime: string }
  | { valid: false; reason: string };

function isValidPdf(bytes: Buffer): boolean {
  if (bytes.length < 32) return false;
  // %PDF-
  if (
    bytes[0] !== 0x25 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x44 ||
    bytes[3] !== 0x46 ||
    bytes[4] !== 0x2d
  ) {
    return false;
  }
  // Ensure %%EOF marker exists near the end of the file
  const tail = bytes.subarray(Math.max(0, bytes.length - 1024)).toString("latin1");
  return tail.includes("%%EOF");
}

function isValidDocx(bytes: Buffer): { ok: boolean; reason?: string } {
  if (bytes.length < 64) return { ok: false, reason: "Document is too small to be a valid DOCX file." };
  // Local file header PK\x03\x04
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    return { ok: false, reason: "Invalid DOCX header." };
  }

  // Locate End of Central Directory (EOCD) signature PK\x05\x06
  const searchStart = Math.max(0, bytes.length - 65557);
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= searchStart; i--) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    return { ok: false, reason: "Malformed DOCX archive (missing central directory)." };
  }

  const totalEntries = bytes.readUInt16LE(eocdOffset + 10);
  if (totalEntries === 0 || totalEntries > MAX_ZIP_ENTRIES) {
    return { ok: false, reason: "Archive structure exceeds safety limits." };
  }

  const cdOffset = bytes.readUInt32LE(eocdOffset + 16);
  const cdSize = bytes.readUInt32LE(eocdOffset + 12);
  if (cdOffset + cdSize > bytes.length) {
    return { ok: false, reason: "Corrupted DOCX central directory." };
  }

  let hasContentTypes = false;
  let hasWordDocument = false;
  let pos = cdOffset;

  for (let i = 0; i < totalEntries && pos + 46 <= cdOffset + cdSize; i++) {
    if (bytes[pos] !== 0x50 || bytes[pos + 1] !== 0x4b || bytes[pos + 2] !== 0x01 || bytes[pos + 3] !== 0x02) {
      return { ok: false, reason: "Invalid central directory entry." };
    }
    const uncompressedSize = bytes.readUInt32LE(pos + 24);
    if (uncompressedSize > 25 * 1024 * 1024) {
      return { ok: false, reason: "Archive entry exceeds safe decompressed size limit." };
    }
    const nameLen = bytes.readUInt16LE(pos + 28);
    const extraLen = bytes.readUInt16LE(pos + 30);
    const commentLen = bytes.readUInt16LE(pos + 32);
    const name = bytes.subarray(pos + 46, pos + 46 + nameLen).toString("utf8");

    if (name.includes("..") || name.startsWith("/")) {
      return { ok: false, reason: "Unsafe path detected inside archive." };
    }
    if (name === "[Content_Types].xml") hasContentTypes = true;
    if (name === "word/document.xml") hasWordDocument = true;

    pos += 46 + nameLen + extraLen + commentLen;
  }

  if (!hasContentTypes || !hasWordDocument) {
    return { ok: false, reason: "File is a ZIP archive, not a valid Microsoft Word (.docx) document." };
  }

  return { ok: true };
}

export function validateResumeBuffer(bytes: Buffer): ValidatedResume {
  if (bytes.length === 0) {
    return { valid: false, reason: "Uploaded file is empty." };
  }
  if (bytes.length > MAX_RESUME_BYTES) {
    return { valid: false, reason: "Résumé must be 4 MB or smaller." };
  }

  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    if (!isValidPdf(bytes)) {
      return { valid: false, reason: "Invalid or corrupted PDF file." };
    }
    return { valid: true, ext: "pdf", mime: "application/pdf" };
  }

  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    const check = isValidDocx(bytes);
    if (!check.ok) {
      return { valid: false, reason: check.reason || "Invalid DOCX document." };
    }
    return {
      valid: true,
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  return { valid: false, reason: "Only valid PDF and Word (.docx) files are accepted." };
}
