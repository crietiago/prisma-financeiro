# Dominio prismafinanceiro.app.br

Para usar `prismafinanceiro.app.br` na Vercel:

1. Abra o projeto na Vercel.
2. Va em **Settings > Domains**.
3. Adicione `prismafinanceiro.app.br`.
4. Adicione `www.prismafinanceiro.app.br`.
5. No provedor de DNS do dominio, configure:

```text
Tipo  Nome  Valor
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

A propagacao pode levar alguns minutos, mas em alguns provedores pode demorar algumas horas.
