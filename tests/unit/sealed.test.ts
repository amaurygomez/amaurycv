import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseKey, seal, unseal } from "../../src/lib/server/sealed";

const key = parseKey(randomBytes(32).toString("base64"));
const plain = Buffer.from("%PDF-1.7\nsample document body\n%%EOF");

describe("sealed blobs", () => {
  it("round-trips the original bytes", () => {
    const blob = seal(plain, key, "cv:en");
    expect(unseal(blob, key, "cv:en").equals(plain)).toBe(true);
  });

  it("rejects a different key", () => {
    const blob = seal(plain, key, "cv:en");
    const other = parseKey(randomBytes(32).toString("base64"));
    expect(() => unseal(blob, other, "cv:en")).toThrow();
  });

  it("rejects a blob sealed for another language", () => {
    const blob = seal(plain, key, "cv:en");
    expect(() => unseal(blob, key, "cv:es")).toThrow();
  });

  it("rejects a truncated blob", () => {
    const bytes = Buffer.from(seal(plain, key, "cv:en"), "base64");
    expect(() =>
      unseal(bytes.subarray(0, bytes.length - 1).toString("base64"), key, "cv:en"),
    ).toThrow();
    expect(() => unseal(bytes.subarray(0, 20).toString("base64"), key, "cv:en")).toThrow();
  });
});
