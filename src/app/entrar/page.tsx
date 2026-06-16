import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ next?: string; erro?: string; saiu?: string; cadastro?: string }>;

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
        <p className="lead">Acesse o app para continuar sua organizacao financeira.</p>

        {params.erro ? <p className="alert">E-mail ou senha invalidos.</p> : null}
        {params.saiu ? <p className="success">Sessao encerrada.</p> : null}
        {params.cadastro ? (
          <p className="success">Cadastro criado. Se o Supabase pedir confirmacao, confira seu e-mail antes de entrar.</p>
        ) : null}

        <form action="/api/login" method="post" className="login-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" />
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Entrar no app</button>
        </form>

        <p className="login-link">
          Ainda nao tem acesso? <a href={`/cadastro?next=${encodeURIComponent(next)}`}>Criar cadastro</a>
        </p>
      </section>
    </main>
  );
}
