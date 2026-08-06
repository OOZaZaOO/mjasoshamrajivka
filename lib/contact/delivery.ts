import type { ContactPayload } from "./schema";
import { sendTelegram } from "./telegram";
import { sendEmail } from "./email";

export type DeliveryChannel = "telegram" | "email";
export type DeliveryResult = {
  status: "disabled" | "delivered" | "partial" | "failed";
  successfulChannels: DeliveryChannel[];
  failedChannels: DeliveryChannel[];
};

export type DeliveryAdapter = (payload: ContactPayload) => Promise<void>;
export type DeliveryAdapters = Record<DeliveryChannel, DeliveryAdapter>;

const defaultAdapters: DeliveryAdapters = { telegram: sendTelegram, email: sendEmail };

export function deliveryHttpStatus(result: DeliveryResult): 200 | 502 | 503 {
  return result.status === "disabled" ? 503 : result.status === "failed" ? 502 : 200;
}

export async function deliverContact(payload: ContactPayload, adapters: DeliveryAdapters = defaultAdapters) {
  const jobs: Array<{ channel: DeliveryChannel; job: Promise<void> }> = [];
  if (process.env.CONTACT_TELEGRAM_ENABLED === "true") jobs.push({ channel: "telegram", job: adapters.telegram(payload) });
  if (process.env.CONTACT_EMAIL_ENABLED === "true") jobs.push({ channel: "email", job: adapters.email(payload) });
  if (!jobs.length) return { status: "disabled", successfulChannels: [], failedChannels: [] } satisfies DeliveryResult;
  const results = await Promise.allSettled(jobs.map(({ job }) => job));
  const successfulChannels = jobs.flatMap(({ channel }, index) => results[index]?.status === "fulfilled" ? [channel] : []);
  const failedChannels = jobs.flatMap(({ channel }, index) => results[index]?.status === "rejected" ? [channel] : []);
  const status = successfulChannels.length === jobs.length ? "delivered" : successfulChannels.length ? "partial" : "failed";
  return { status, successfulChannels, failedChannels } satisfies DeliveryResult;
}
