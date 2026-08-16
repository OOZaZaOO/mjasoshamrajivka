"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSignIn({ configurationError = false }: { configurationError?: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) {
      const result = await response.json().catch(() => null) as { error?: string } | null;
      setError(result?.error || "Не вдалося виконати вхід.");
      setPending(false);
      return;
    }
    router.push("/admin/assortment");
    router.refresh();
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-auth-title">
        <p className="admin-eyebrow">М&apos;ЯСНИЙ · АДМІН</p>
        <h1 id="admin-auth-title">Вхід до панелі</h1>
        <p>Закрита панель керування асортиментом.</p>
        {configurationError && <div className="admin-auth-error">Адмін-авторизація ще не налаштована у .env.local.</div>}
        {error && <div className="admin-auth-error" role="alert">{error}</div>}
        <form onSubmit={submit} className="admin-form">
          <label>Пароль<input className="admin-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-button admin-button--primary" type="submit" disabled={pending}>{pending ? "Вхід..." : "Увійти"}</button>
        </form>
      </section>
    </main>
  );
}
