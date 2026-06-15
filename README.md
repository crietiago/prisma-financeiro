# Prisma Financeiro

Projeto Web/PWA do Prisma Financeiro.

## Estrutura

- `index.html`: site institucional.
- `app.html`: app Prisma Financeiro.
- `manifest.json`: configuracao PWA.
- `service-worker.js`: cache offline basico.
- `assets/`: icones e ativos publicos.
- `vercel.json`: configuracao para deploy na Vercel.

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

- Site: `http://localhost:5173/`
- App: `http://localhost:5173/app.html`

## Deploy gratuito na Vercel

1. Suba este projeto para o GitHub.
2. Acesse https://vercel.com/new.
3. Importe o repositorio `prisma-financeiro`.
4. Use as configuracoes padrao de projeto estatico.
5. Clique em **Deploy**.

O site institucional fica na raiz e o app fica em `/app.html`.
