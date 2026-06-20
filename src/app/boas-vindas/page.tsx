import { WelcomeSession } from "./welcome-session";

type SearchParams = Promise<{ next?: string }>;

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/app.html";
}

export default async function BoasVindasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);

  return (
    <main className="login-shell">
      <section className="login-card welcome-card" aria-label="Boas-vindas Prisma Financeiro">
        <div className="login-brand">
          <img src="/brand/logo" alt="Prisma Financeiro" />
        </div>
        <h1>Bem-vindo(a)</h1>
        <p className="lead">
          Seu e-mail foi confirmado. Agora você pode continuar seu diagnóstico e salvar sua jornada financeira com
          segurança.
        </p>
        <WelcomeSession next={next} />
      </section>
    </main>
  );
}
