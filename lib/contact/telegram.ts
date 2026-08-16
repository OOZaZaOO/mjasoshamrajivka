import type { ContactPayload } from "./schema";

export type ContactDeliveryContext = {
  page: string;
  submittedAt: string;
};

export async function sendTelegram(payload: ContactPayload, context: ContactDeliveryContext) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram credentials are missing");

  const text = [
    "🔔 Нова заявка з сайту «М’ясний»",
    "",
    `Ім’я: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Повідомлення: ${payload.message || "—"}`,
    `Сторінка: ${context.page}`,
    `Час: ${context.submittedAt}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json().catch(() => null) as { ok?: boolean; description?: string } | null;
  if (!response.ok || !result?.ok) throw new Error(`Telegram delivery failed: ${result?.description ?? response.status}`);
}
