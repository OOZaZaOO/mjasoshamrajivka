export function trackEvent(_name: string, _properties?: Record<string, string | number | boolean>) {
  // Integration point: add a provider here when a client opts into analytics.
  void _name;
  void _properties;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" || typeof window === "undefined") return;
}
