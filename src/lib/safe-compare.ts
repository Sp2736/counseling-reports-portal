import crypto from "crypto";

/**
 * Constant-time string comparison. Both values are hashed first so the
 * comparison never leaks length or content through timing.
 */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}
