import { isAuthenticated } from "@/lib/auth";
import { PRIVACY_VERSION, TERMS_VERSION } from "@/lib/compliance";
import { isSupabaseConfigured } from "@/lib/supabase";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ next?: string; erro?: string }>;

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
}

function errorMessage(error?: string) {
  if (error === "limite-email") {
    return "O envio de confirmacao esta temporariamente indisponivel. Aguarde alguns minutos e tente novamente.";
  }
  if (error === "dados") return "Confira o e-mail e use uma senha segura com pelo menos 8 caracteres.";
  if (error) return "Nao foi possivel criar o cadastro agora. Tente novamente em alguns minutos.";
  return null;
}

export default async function CadastroPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const alert = errorMessage(params.erro);

  if (await isAuthenticated()) redirect(next);

  return (
    <main className="login-shell">
      <section className="login-card" aria-label="Cadastro Prisma Financeiro">
        <div className="login-brand">
          <img src="/brand/logo" alt="Prisma Financeiro" />
        </div>
        <h1>Criar acesso</h1>
        <p className="lead">Cadastre-se para salvar seu progresso financeiro na nuvem.</p>

        {!isSupabaseConfigured() ? (
          <p className="alert">Cadastro em nuvem ainda nao configurado. Configure o Supabase na Vercel.</p>
        ) : null}
        {alert ? <p className="alert">{alert}</p> : null}

        <form action="/api/cadastro" method="post" className="login-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          <input type="hidden" name="termsVersion" value={TERMS_VERSION} />
          <input type="hidden" name="privacyVersion" value={PRIVACY_VERSION} />
          <label className="consent-check">
            <input name="privacyConsent" type="checkbox" value="accepted" required />
            <span>
              Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e a{" "}
              <a href="/privacidade" target="_blank">Política de Privacidade</a>, incluindo o tratamento dos meus dados
              para criar minha conta, salvar meu progresso e entregar a experiência do Prisma Financeiro.
            </span>
          </label>
          <button type="submit">Criar cadastro</button>
        </form>

        <p className="login-link">
          Ja tem acesso? <a href={`/entrar?next=${encodeURIComponent(next)}`}>Entrar</a>
        </p>
      </section>
    </main>
  );
}
