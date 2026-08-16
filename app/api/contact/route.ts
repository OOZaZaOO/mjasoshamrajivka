import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact/schema";
import { deliverContact, deliveryHttpStatus } from "@/lib/contact/delivery";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestsByIp = new Map<string, { count: number; resetAt: number }>();

const MAX_BODY_BYTES = 16_384;

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = getClientIp(request);
  const current = requestsByIp.get(key);
  if (!current || current.resetAt <= now) {
    requestsByIp.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

async function readBodyWithinLimit(request: Request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(request)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (contentType !== "application/json") return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    const rawBody = await readBodyWithinLimit(request);
    if (rawBody === null) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ ok: true });
    const referer = request.headers.get("referer");
    const page = referer ? new URL(referer).pathname : "/";
    const delivery = await deliverContact(parsed.data, { page, submittedAt: new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }) });
    const deliveryStatus = deliveryHttpStatus(delivery);
    if (deliveryStatus === 503) return NextResponse.json({ error: "Contact delivery is not configured." }, { status: deliveryStatus });
    if (deliveryStatus === 502) return NextResponse.json({ error: "Unable to deliver your request right now." }, { status: deliveryStatus });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact submission failed", error);
    return NextResponse.json({ error: "Unable to send your request right now." }, { status: 500 });
  }
}
