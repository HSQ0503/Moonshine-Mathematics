"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginForm({ next, error }: { next?: string; error?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(error ?? null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    router.push(next || "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {err && (
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "#a44", fontSize: 14, margin: "8px 0 16px" }}>
          {err}
        </div>
      )}
      <button className="btn" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
