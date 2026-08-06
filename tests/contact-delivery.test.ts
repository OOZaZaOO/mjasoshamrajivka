import assert from "node:assert/strict";
import test from "node:test";
import { deliverContact, deliveryHttpStatus } from "../lib/contact/delivery";
import { contactSchema } from "../lib/contact/schema";

const payload = { name: "Test User", phone: "123456", email: "test@example.com", message: "A valid test message." };
const adapters = {
  telegram: async () => {},
  email: async () => {},
};

async function withChannels(channels: { telegram?: string; email?: string }, callback: () => Promise<void>) {
  const previous = { telegram: process.env.CONTACT_TELEGRAM_ENABLED, email: process.env.CONTACT_EMAIL_ENABLED };
  if (channels.telegram === undefined) delete process.env.CONTACT_TELEGRAM_ENABLED; else process.env.CONTACT_TELEGRAM_ENABLED = channels.telegram;
  if (channels.email === undefined) delete process.env.CONTACT_EMAIL_ENABLED; else process.env.CONTACT_EMAIL_ENABLED = channels.email;
  try { await callback(); } finally {
    if (previous.telegram === undefined) delete process.env.CONTACT_TELEGRAM_ENABLED; else process.env.CONTACT_TELEGRAM_ENABLED = previous.telegram;
    if (previous.email === undefined) delete process.env.CONTACT_EMAIL_ENABLED; else process.env.CONTACT_EMAIL_ENABLED = previous.email;
  }
}

test("Telegram success + SMTP failure is partial success", async () => {
  await withChannels({ telegram: "true", email: "true" }, async () => {
    const result = await deliverContact(payload, { ...adapters, email: async () => { throw new Error("SMTP failure"); } });
    assert.equal(result.status, "partial");
    assert.equal(deliveryHttpStatus(result), 200);
    assert.deepEqual(result.successfulChannels, ["telegram"]);
    assert.deepEqual(result.failedChannels, ["email"]);
  });
});

test("Telegram failure + SMTP success is partial success", async () => {
  await withChannels({ telegram: "true", email: "true" }, async () => {
    const result = await deliverContact(payload, { ...adapters, telegram: async () => { throw new Error("Telegram failure"); } });
    assert.equal(result.status, "partial");
    assert.equal(deliveryHttpStatus(result), 200);
    assert.deepEqual(result.successfulChannels, ["email"]);
    assert.deepEqual(result.failedChannels, ["telegram"]);
  });
});

test("both active channels succeeding is delivered", async () => {
  await withChannels({ telegram: "true", email: "true" }, async () => { const result = await deliverContact(payload, adapters); assert.equal(result.status, "delivered"); assert.equal(deliveryHttpStatus(result), 200); });
});

test("all active channels failing is failed", async () => {
  await withChannels({ telegram: "true", email: "true" }, async () => {
    const result = await deliverContact(payload, { telegram: async () => { throw new Error("Telegram failure"); }, email: async () => { throw new Error("SMTP failure"); } });
    assert.equal(result.status, "failed");
    assert.equal(deliveryHttpStatus(result), 502);
    assert.deepEqual(result.successfulChannels, []);
  });
});

test("no enabled channels is disabled", async () => {
  await withChannels({ telegram: "false", email: "false" }, async () => { const result = await deliverContact(payload, adapters); assert.equal(result.status, "disabled"); assert.equal(deliveryHttpStatus(result), 503); });
});

test("honeypot payload validates and is handled before delivery", () => {
  const parsed = contactSchema.safeParse({ ...payload, website: "automated-value" });
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(Boolean(parsed.data.website), true);
});
