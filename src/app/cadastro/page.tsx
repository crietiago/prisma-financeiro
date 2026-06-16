import { isAuthenticated } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ next?: string; erro?: string }>;

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
}

export default async function CadastroPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);

  if (await isAuthenticated()) redirect(next);

  return (
    <main className="login-shell">
      <section className="login-card" aria-label="Cadastro Prisma Financeiro">
        <img src="/assets/icon.svg" alt="" className="login-icon" />
        <p className="eyebrow">Prisma Financeiro</p>
        <h1>Criar acesso</h1>
        <p className="lead">Cadastre-se para salvar seu progresso financeiro na nuvem.</p>

        {!isSupabaseConfigured() ? (
          <p className="alert">Cadastro em nuvem ainda nao configurado. Configure o Supabase na Vercel.</p>
        ) : null}
        {params.erro ? <p className="alert">Nao foi possivel criar o cadastro. Confira os dados.</p> : null}

        <form action="/api/cadastro" method="post" className="login-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <button type="submit">Criar cadastro</button>
        </form>

        <p className="login-link">
          Ja tem acesso? <a href={`/entrar?next=${encodeURIComponent(next)}`}>Entrar</a>
        </p>
      </section>
    </main>
  );
}
