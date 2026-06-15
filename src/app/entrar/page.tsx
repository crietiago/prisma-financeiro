import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ next?: string; erro?: string; saiu?: string }>;

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);

  if (await isAuthenticated()) redirect(next);

  return (
    <main className="login-shell">
      <section className="login-card" aria-label="Entrada Prisma Financeiro">
        <img src="/assets/icon.svg" alt="" className="login-icon" />
        <p className="eyebrow">Prisma Financeiro</p>
        <h1>Entrada segura</h1>
        <p className="lead">Acesse o app para continuar sua organização financeira.</p>

        {params.erro ? <p className="alert">Senha de acesso inválida.</p> : null}
        {params.saiu ? <p className="success">Sessão encerrada.</p> : null}

        <form action="/api/login" method="post" className="login-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="password">Senha de acesso</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Entrar no app</button>
        </form>
      </section>
    </main>
  );
}
