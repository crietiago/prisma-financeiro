# Prisma Financeiro

Web app/PWA do Prisma Financeiro com site institucional publico e app protegido por entrada autenticada.

## Rotas

- `/`: site institucional.
- `/entrar`: tela de acesso.
- `/app` e `/app.html`: app Prisma Financeiro protegido por sessao.

## Autenticacao

A entrada do app usa uma senha de acesso definida por variavel de ambiente e cria uma sessao em cookie HTTP-only assinado.

Crie um arquivo `.env.local` para desenvolvimento:

```bash
APP_ACCESS_PASSWORD=troque-esta-senha
AUTH_SECRET=gere-um-segredo-longo
```

Sem `.env.local`, o ambiente local aceita a senha `prisma2026`. Em producao, defina obrigatoriamente `APP_ACCESS_PASSWORD`.

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
3. Publique o projeto.
4. Adicione o dominio `prismafinanceiro.app.br` ao projeto.

## DNS para o dominio

No provedor onde o dominio `prismafinanceiro.app.br` foi comprado, aponte:

- `A` para `76.76.21.21` no dominio raiz `prismafinanceiro.app.br`
- `CNAME` de `www` para `cname.vercel-dns-0.com`

Depois configure os dois dominios na Vercel:

- `prismafinanceiro.app.br`
- `www.prismafinanceiro.app.br`

Depois de adicionar o dominio na Vercel, confirme os valores finais recomendados em **Settings > Domains** ou com `vercel domains inspect prismafinanceiro.app.br`.
