# Prisma Financeiro

Web app/PWA do Prisma Financeiro com site institucional publico, cadastro/login e app protegido por sessao.

## Rotas

- `/`: site institucional.
- `/entrar`: tela de acesso.
- `/cadastro`: criacao de conta.
- `/app` e `/app.html`: app Prisma Financeiro protegido por sessao.

## Autenticacao

O fluxo principal usa Supabase Auth com e-mail e senha. O app tambem mantem uma senha unica como fallback administrativo enquanto o Supabase nao estiver configurado.

Crie um arquivo `.env.local` para desenvolvimento:

```bash
APP_ACCESS_PASSWORD=troque-esta-senha
AUTH_SECRET=gere-um-segredo-longo
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Sem `.env.local`, o ambiente local aceita a senha fallback `prisma2026`. Em producao, configure o Supabase para cadastro real.

## Dados na nuvem

O app legado salva o estado financeiro no navegador. Quando o usuario entra com Supabase, o projeto sincroniza esse estado com a tabela `public.financial_states`.

No Supabase:

1. Crie um projeto.
2. Em **Authentication > Providers**, mantenha **Email** habilitado.
3. Em **SQL Editor**, execute o arquivo `supabase/schema.sql`.
4. Copie `Project URL` e `anon public key` para as variaveis da Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

O primeiro acesso deve passar pelo site institucional em `/`. O botao do site leva para `/app.html`, que redireciona para `/entrar` se a pessoa ainda nao tiver sessao.

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

- Site: `http://localhost:3000/`
- App: `http://localhost:3000/app.html`

## Deploy na Vercel

1. Importe o repositorio `crietiago/prisma-financeiro` na Vercel.
2. Configure as variaveis:
   - `APP_ACCESS_PASSWORD`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Publique o projeto.
4. Adicione o dominio `prismafinanceiro.app.br` ao projeto.

## DNS para o dominio

No provedor onde o dominio `prismafinanceiro.app.br` foi comprado, aponte:

- `A` para `76.76.21.21` no dominio raiz `prismafinanceiro.app.br`
- `A` para `76.76.21.21` em `www.prismafinanceiro.app.br`

Depois configure os dois dominios na Vercel:

- `prismafinanceiro.app.br`
- `www.prismafinanceiro.app.br`

Depois de adicionar o dominio na Vercel, confirme os valores finais recomendados em **Settings > Domains** ou com `vercel domains inspect prismafinanceiro.app.br`.
