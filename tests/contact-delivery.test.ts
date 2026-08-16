import assert from "node:assert/strict";
import test from "node:test";
import { deliverContact, deliveryHttpStatus } from "../lib/contact/delivery";
import { contactSchema } from "../lib/contact/schema";

const payload = { name: "Test User", phone: "123456", email: "test@example.com", message: "A valid test message." };
const context = { page: "/", submittedAt: "01.01.2026, 12:00:00" };
const adapters = { telegram: async () => {} };

async function withTelegram(configured: boolean, callback: () => Promise<void>) {
  const previous = { token: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID };
  if (configured) {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "test-chat";
  } else {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
  }
  try { await callback(); } finally {
    if (previous.token === undefined) delete process.env.TELEGRAM_BOT_TOKEN; else process.env.TELEGRAM_BOT_TOKEN = previous.token;
    if (previous.chatId === undefined) delete process.env.TELEGRAM_CHAT_ID; else process.env.TELEGRAM_CHAT_ID = previous.chatId;
  }
}

test("Telegram delivery succeeds", async () => {
  await withTelegram(true, async () => {
    const result = await deliverContact(payload, context, adapters);
    assert.equal(result.status, "delivered");
    assert.equal(deliveryHttpStatus(result), 200);
  });
});

test("Telegram delivery failure returns 502", async () => {
  await withTelegram(true, async () => {
    const result = await deliverContact(payload, context, { telegram: async () => { throw new Error("Telegram failure"); } });
    assert.equal(result.status, "failed");
    assert.equal(deliveryHttpStatus(result), 502);
  });
});

test("missing Telegram configuration returns 503", async () => {
  await withTelegram(false, async () => {
    const result = await deliverContact(payload, context, adapters);
    assert.equal(result.status, "disabled");
    assert.equal(deliveryHttpStatus(result), 503);
  });
});

test("honeypot payload validates and is handled before delivery", () => {
  const parsed = contactSchema.safeParse({ ...payload, website: "automated-value" });
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(Boolean(parsed.data.website), true);
});
