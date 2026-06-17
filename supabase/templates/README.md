# Templates de e-mail do Prisma Financeiro

## Confirm sign up

Assunto sugerido:

```text
Bem-vindo(a) ao Prisma Financeiro - confirme seu e-mail
```

Onde configurar no Supabase:

```text
Authentication > Emails / Email Templates > Confirm sign up
```

Cole o conteudo de `confirm-signup.html` no campo de corpo HTML do template.

O link de confirmacao usa a variavel oficial do Supabase:

```text
{{ .ConfirmationURL }}
```

Para trocar o remetente `Supabase Auth <noreply@mail.app.supabase.io>`, configure SMTP proprio em:

```text
Project Settings > Authentication > SMTP Settings
```
