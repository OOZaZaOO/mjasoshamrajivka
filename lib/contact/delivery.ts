import type { ContactPayload } from "./schema";
import type { ContactDeliveryContext } from "./telegram";
import { sendTelegram } from "./telegram";

export type DeliveryChannel = "telegram";
export type DeliveryResult = {
  status: "disabled" | "delivered" | "partial" | "failed";
  successfulChannels: DeliveryChannel[];
  failedChannels: DeliveryChannel[];
};

export type DeliveryAdapters = Record<DeliveryChannel, (payload: ContactPayload, context: ContactDeliveryContext) => Promise<void>>;

const defaultAdapters: DeliveryAdapters = { telegram: sendTelegram };

export function deliveryHttpStatus(result: DeliveryResult): 200 | 502 | 503 {
  return result.status === "disabled" ? 503 : result.status === "failed" ? 502 : 200;
}

export async function deliverContact(payload: ContactPayload, context: ContactDeliveryContext, adapters: DeliveryAdapters = defaultAdapters) {
  const jobs: Array<{ channel: DeliveryChannel; job: Promise<void> }> = [];
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) jobs.push({ channel: "telegram", job: adapters.telegram(payload, context) });
  if (!jobs.length) return { status: "disabled", successfulChannels: [], failedChannels: [] } satisfies DeliveryResult;
  const results = await Promise.allSettled(jobs.map(({ job }) => job));
  const successfulChannels = jobs.flatMap(({ channel }, index) => results[index]?.status === "fulfilled" ? [channel] : []);
  const failedChannels = jobs.flatMap(({ channel }, index) => results[index]?.status === "rejected" ? [channel] : []);
  const status = successfulChannels.length === jobs.length ? "delivered" : successfulChannels.length ? "partial" : "failed";
  return { status, successfulChannels, failedChannels } satisfies DeliveryResult;
}
