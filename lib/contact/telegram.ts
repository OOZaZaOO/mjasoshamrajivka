import type { ContactPayload } from "./schema";

export async function sendTelegram(payload: ContactPayload) {
  const token = process.env.CONTACT_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CONTACT_TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is enabled but credentials are missing");
  const text = [`New contact request`, `Name: ${payload.name}`, `Phone: ${payload.phone}`, `Email: ${payload.email}`, `Message: ${payload.message}`].join("\n");
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Telegram delivery failed with ${response.status}`);
}
