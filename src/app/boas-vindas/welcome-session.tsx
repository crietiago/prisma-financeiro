"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "checking" | "ready" | "manual";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/app.html";
}

export function WelcomeSession({ next }: { next: string }) {
  const [status, setStatus] = useState<Status>("checking");
  const destination = useMemo(() => safeNext(next), [next]);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const expiresIn = hash.get("expires_in");

    if (!accessToken) {
      setStatus("manual");
      return;
    }

    fetch("/api/supabase-session", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn ? Number(expiresIn) : undefined,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Invalid session");
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setStatus("ready");
      })
      .catch(() => setStatus("manual"));
  }, []);

  return (
    <>
      {status === "checking" ? <p className="success">Confirmando seu acesso com segurança...</p> : null}
      {status === "ready" ? <p className="success">E-mail confirmado. Sua entrada segura está pronta.</p> : null}
      {status === "manual" ? (
        <p className="success">E-mail confirmado. Entre com seu e-mail e senha para continuar.</p>
      ) : null}

      <a className="primary-link" href={status === "ready" ? destination : `/entrar?cadastro=1&next=${encodeURIComponent(destination)}`}>
        Entrar no app
      </a>
    </>
  );
}
