import { DPO_EMAIL, TERMS_VERSION } from "@/lib/compliance";

export default function TermosPage() {
  return (
    <main className="legal-shell">
      <article className="legal-document">
        <p className="eyebrow">Prisma Financeiro</p>
        <h1>Termos de Uso</h1>
        <p className="legal-meta">Versão {TERMS_VERSION}</p>

        <p>
          Estes termos regulam o uso do Prisma Financeiro App, uma ferramenta digital de organização, diagnóstico e
          acompanhamento financeiro pessoal.
        </p>

        <h2>Natureza do serviço</h2>
        <p>
          O Prisma Financeiro oferece apoio educacional e organizacional. O app não substitui consultoria financeira,
          contábil, jurídica, tributária ou de investimento prestada por profissional habilitado.
        </p>

        <h2>Conta e responsabilidade do usuário</h2>
        <p>
          O usuário deve informar dados corretos, manter sua senha protegida e utilizar o serviço de forma lícita. A
          conta é individual e não deve ser compartilhada com terceiros.
        </p>

        <h2>Dados e consentimento</h2>
        <p>
          Ao criar a conta, o usuário declara que leu e aceitou estes Termos e a Política de Privacidade, autorizando o
          tratamento dos dados necessários para autenticação, salvamento de progresso, segurança e funcionamento do app.
        </p>

        <h2>Limitações</h2>
        <p>
          As informações apresentadas pelo app dependem dos dados fornecidos pelo usuário. O Prisma Financeiro não garante
          resultados financeiros específicos e não se responsabiliza por decisões tomadas exclusivamente com base no app.
        </p>

        <h2>Segurança</h2>
        <p>
          O serviço adota medidas técnicas e organizacionais razoáveis para proteger o acesso, mas nenhum ambiente digital
          é absolutamente imune a riscos. Incidentes relevantes serão tratados conforme a legislação aplicável.
        </p>

        <h2>Alterações</h2>
        <p>
          Estes termos podem ser atualizados para refletir mudanças no produto, exigências legais ou melhorias de
          segurança. Mudanças relevantes poderão exigir novo aceite.
        </p>

        <h2>Contato</h2>
        <p>
          Dúvidas sobre estes termos ou privacidade podem ser enviadas para{" "}
          <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>.
        </p>

        <p className="legal-note">
          Documento operacional para uso no produto. Recomenda-se revisão jurídica antes de uso comercial em larga escala.
        </p>
      </article>
    </main>
  );
}
