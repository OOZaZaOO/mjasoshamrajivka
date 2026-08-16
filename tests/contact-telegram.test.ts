import assert from "node:assert/strict";
import test from "node:test";
import { sendTelegram } from "../lib/contact/telegram";

const payload = { name: "Олена", phone: "+380 00 000 0000", message: "Потрібне замовлення на вихідні." };
const context = { page: "/assortment", submittedAt: "01.01.2026, 12:00:00" };

async function withCredentials(callback: () => Promise<void>) {
  const previous = { token: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID };
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_CHAT_ID = "test-chat";
  try { await callback(); } finally {
    if (previous.token === undefined) delete process.env.TELEGRAM_BOT_TOKEN; else process.env.TELEGRAM_BOT_TOKEN = previous.token;
    if (previous.chatId === undefined) delete process.env.TELEGRAM_CHAT_ID; else process.env.TELEGRAM_CHAT_ID = previous.chatId;
  }
}

test("sendTelegram sends a readable plain-text message", async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    assert.match(String(input), /api\.telegram\.org\/bottest-token\/sendMessage/);
    const body = JSON.parse(String(init?.body));
    assert.match(body.text, /Нова заявка з сайту/);
    assert.match(body.text, /Олена/);
    assert.equal(body.chat_id, "test-chat");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  try { await withCredentials(() => sendTelegram(payload, context)); } finally { globalThis.fetch = previousFetch; }
});

test("sendTelegram rejects missing credentials", async () => {
  const previousToken = process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_BOT_TOKEN;
  await assert.rejects(() => sendTelegram(payload, context), /credentials are missing/);
  if (previousToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN; else process.env.TELEGRAM_BOT_TOKEN = previousToken;
});

test("sendTelegram rejects a Telegram API error", async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false, description: "Bad Request: chat not found" }), { status: 400 });
  try {
    await withCredentials(() => assert.rejects(() => sendTelegram(payload, context), /chat not found/));
  } finally { globalThis.fetch = previousFetch; }
});
