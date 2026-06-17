import { DPO_EMAIL, PRIVACY_VERSION } from "@/lib/compliance";

export default function PrivacidadePage() {
  return (
    <main className="legal-shell">
      <article className="legal-document">
        <p className="eyebrow">Prisma Financeiro</p>
        <h1>Política de Privacidade</h1>
        <p className="legal-meta">Versão {PRIVACY_VERSION}</p>

        <p>
          Esta política explica, de forma objetiva, como o Prisma Financeiro trata dados pessoais para criar a conta,
          proteger o acesso e salvar o progresso financeiro do usuário no app.
        </p>

        <h2>Dados tratados</h2>
        <p>
          Podemos tratar nome, e-mail, senha protegida pelo provedor de autenticação, dados preenchidos no diagnóstico,
          preferências, progresso no app, registros técnicos de segurança e comprovação do aceite dos termos.
        </p>

        <h2>Finalidades</h2>
        <p>
          Os dados são usados para autenticar o usuário, manter sua sessão segura, salvar informações na nuvem,
          recuperar o progresso, melhorar a experiência e cumprir obrigações legais ou regulatórias aplicáveis.
        </p>

        <h2>Base legal</h2>
        <p>
          O tratamento pode se apoiar na execução de contrato ou procedimentos preliminares, no consentimento para
          determinadas comunicações e funcionalidades, no legítimo interesse para segurança e prevenção a fraude, e no
          cumprimento de obrigação legal quando aplicável.
        </p>

        <h2>Compartilhamento</h2>
        <p>
          O Prisma Financeiro usa fornecedores técnicos para hospedagem, autenticação, banco de dados e envio de e-mails.
          Esses fornecedores atuam para viabilizar a operação do serviço e devem observar padrões de segurança e
          proteção de dados.
        </p>

        <h2>Segurança e segregação</h2>
        <p>
          O app utiliza autenticação, cookies HTTP-only, conexão HTTPS, políticas de acesso por usuário e regras de RLS
          no banco de dados para reduzir o risco de acesso indevido aos dados de outros usuários.
        </p>

        <h2>Direitos do titular</h2>
        <p>
          O usuário pode solicitar confirmação de tratamento, acesso, correção, exclusão, portabilidade quando aplicável,
          informação sobre compartilhamento e revogação de consentimento, nos termos da LGPD.
        </p>

        <h2>Canal de privacidade</h2>
        <p>
          Para exercer direitos ou tirar dúvidas sobre dados pessoais, entre em contato pelo e-mail{" "}
          <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>.
        </p>

        <p className="legal-note">
          Documento operacional para uso no produto. Recomenda-se revisão jurídica antes de uso comercial em larga escala.
        </p>
      </article>
    </main>
  );
}
