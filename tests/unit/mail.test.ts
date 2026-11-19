import { Resend } from "resend";
import { afterEach, expect, it, vi } from "vitest";
import { sendOwnerMail } from "../../src/lib/server/mail";

vi.mock("astro:env/server", () => ({
  CONTACT_TO: "owner@example.test",
  RESEND_FROM: "forms@example.test",
  RESEND_API_KEY: "local-test-mail-key",
}));

afterEach(() => vi.restoreAllMocks());

it("passes a bounded deadline to the mail provider and handles its expiry", async () => {
  const controller = new AbortController();
  const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
  const resend = new Resend("local-test-mail-key");
  const send = vi.spyOn(resend.emails, "send").mockImplementation(async (_mail, options) => {
    controller.abort(new DOMException("Test deadline", "TimeoutError"));
    options?.signal?.throwIfAborted();
    throw new Error("Expected provider deadline to have expired");
  });
  vi.spyOn(console, "error").mockImplementation(() => {});

  const message = {
    replyTo: "visitor@example.test",
    subject: "Test form",
    text: "Test message",
    html: "<p>Test message</p>",
  };
  await expect(sendOwnerMail(resend, message)).resolves.toBe(false);
  expect(timeout).toHaveBeenCalledWith(4_000);
  expect(send).toHaveBeenCalledExactlyOnceWith(
    { from: "forms@example.test", to: "owner@example.test", ...message },
    { signal: controller.signal },
  );
});
