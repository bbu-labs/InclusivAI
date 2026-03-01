"use client";

import Navbar from "@/components/Navbar";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-2">
            Política de Privacidade
          </h1>
          <p className="text-sm text-base-content/50 mb-10">
            Última atualização: 28 de fevereiro de 2026
          </p>

          <div className="prose prose-sm max-w-none text-base-content/80 space-y-8">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                1. Controlador de Dados
              </h2>
              <p>
                O controlador dos dados pessoais coletados pela plataforma{" "}
                <strong>Cláusula Oculta</strong> (&ldquo;Plataforma&rdquo;) é a{" "}
                <strong>BBU Labs</strong>, um coletivo independente de
                desenvolvedores de software. Este produto foi concebido como um{" "}
                <strong>MVP (Minimum Viable Product)</strong> no contexto do{" "}
                <strong>Mistral AI Worldwide Hackathon</strong> e tem caráter{" "}
                <strong>experimental e educacional</strong>.
              </p>
              <p>
                Para fins da Lei Geral de Proteção de Dados (LGPD — Lei nº
                13.709/2018) e do Regulamento Geral de Proteção de Dados (GDPR —
                Regulamento (UE) 2016/679), a BBU Labs atua como controladora
                dos dados pessoais dos usuários da Plataforma.
              </p>
              <ul className="list-none pl-0 space-y-1">
                <li>
                  <strong>Contato do Controlador:</strong>{" "}
                  <a
                    href="mailto:contato@bbu.app.br"
                    className="text-primary hover:underline"
                  >
                    contato@bbu.app.br
                  </a>
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                2. Dados Pessoais Coletados
              </h2>
              <p>
                A Plataforma coleta as seguintes categorias de dados pessoais:
              </p>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                2.1 Dados fornecidos pelo usuário
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados de cadastro:</strong> endereço de e-mail e senha
                  (armazenada de forma criptografada);
                </li>
                <li>
                  <strong>Dados de perfil (opcionais):</strong> nome, faixa
                  etária e nível de escolaridade;
                </li>
                <li>
                  <strong>Preferências de acessibilidade:</strong> tamanho de
                  fonte, modo de alto contraste e preferência de linguagem
                  simplificada;
                </li>
                <li>
                  <strong>Documentos enviados:</strong> conteúdo textual de
                  documentos jurídicos ou oficiais submetidos para análise (via
                  upload de arquivo, URL ou imagem);
                </li>
                <li>
                  <strong>Interações com a IA:</strong> perguntas e respostas
                  realizadas sobre os documentos analisados.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                2.2 Dados coletados automaticamente
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados de uso:</strong> data e hora de acessos, páginas
                  visitadas, funcionalidades utilizadas;
                </li>
                <li>
                  <strong>Dados técnicos:</strong> endereço IP, tipo de
                  navegador, sistema operacional, resolução de tela;
                </li>
                <li>
                  <strong>Tokens de autenticação:</strong> tokens JWT (JSON Web
                  Tokens) gerados pelo sistema de autenticação para manter a
                  sessão do usuário.
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                3. Finalidades e Bases Legais do Tratamento
              </h2>
              <p>
                Os dados pessoais são tratados para as seguintes finalidades,
                com as respectivas bases legais conforme a LGPD (Art. 7º) e o
                GDPR (Art. 6º):
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th className="text-base-content">Finalidade</th>
                      <th className="text-base-content">Base Legal (LGPD)</th>
                      <th className="text-base-content">Base Legal (GDPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Criação e gerenciamento de conta</td>
                      <td>Execução de contrato (Art. 7º, V)</td>
                      <td>Execução de contrato (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td>Análise de documentos por IA</td>
                      <td>Execução de contrato (Art. 7º, V)</td>
                      <td>Execução de contrato (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td>Geração de áudio (acessibilidade)</td>
                      <td>Execução de contrato (Art. 7º, V)</td>
                      <td>Execução de contrato (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td>Personalização de acessibilidade</td>
                      <td>Consentimento (Art. 7º, I)</td>
                      <td>Consentimento (Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td>Ranking agregado de empresas</td>
                      <td>Legítimo interesse (Art. 7º, IX)</td>
                      <td>Legítimo interesse (Art. 6(1)(f))</td>
                    </tr>
                    <tr>
                      <td>Compartilhamento público de análises</td>
                      <td>Consentimento (Art. 7º, I)</td>
                      <td>Consentimento (Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td>Segurança e prevenção de fraudes</td>
                      <td>Legítimo interesse (Art. 7º, IX)</td>
                      <td>Legítimo interesse (Art. 6(1)(f))</td>
                    </tr>
                    <tr>
                      <td>Cumprimento de obrigações legais</td>
                      <td>Obrigação legal (Art. 7º, II)</td>
                      <td>Obrigação legal (Art. 6(1)(c))</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                4. Compartilhamento de Dados com Terceiros
              </h2>
              <p>
                Para prestar o serviço, a Plataforma compartilha dados pessoais
                com os seguintes operadores e parceiros:
              </p>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                4.1 Mistral AI (França, União Europeia)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados compartilhados:</strong> conteúdo textual dos
                  documentos enviados, imagens de documentos (para OCR),
                  perguntas do usuário sobre o documento;
                </li>
                <li>
                  <strong>Finalidade:</strong> análise de documentos,
                  simplificação de linguagem, detecção de cláusulas abusivas,
                  detecção de golpes, resposta a perguntas;
                </li>
                <li>
                  <strong>Modelos utilizados:</strong> ministral-8b-latest,
                  mistral-large-latest, pixtral-large-latest;
                </li>
                <li>
                  <strong>Localização:</strong> servidores na União Europeia,
                  sujeitos ao GDPR;
                </li>
                <li>
                  <strong>Política de privacidade:</strong>{" "}
                  <a
                    href="https://mistral.ai/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://mistral.ai/terms/
                  </a>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                4.2 ElevenLabs (Estados Unidos)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados compartilhados:</strong> resumo textual da
                  análise do documento (texto simplificado);
                </li>
                <li>
                  <strong>Finalidade:</strong> conversão de texto em áudio
                  (text-to-speech) para acessibilidade;
                </li>
                <li>
                  <strong>Localização:</strong> servidores nos Estados Unidos;
                </li>
                <li>
                  <strong>Política de privacidade:</strong>{" "}
                  <a
                    href="https://elevenlabs.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://elevenlabs.io/privacy
                  </a>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                4.3 Supabase (Estados Unidos)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados compartilhados:</strong> todos os dados
                  pessoais do usuário (cadastro, documentos, análises,
                  histórico);
                </li>
                <li>
                  <strong>Finalidade:</strong> autenticação de usuários,
                  armazenamento de dados em banco PostgreSQL, armazenamento de
                  arquivos;
                </li>
                <li>
                  <strong>Localização:</strong> servidores nos Estados Unidos;
                </li>
                <li>
                  <strong>Medidas de segurança:</strong> Row Level Security
                  (RLS) em todas as tabelas, garantindo que cada usuário acesse
                  apenas seus próprios dados;
                </li>
                <li>
                  <strong>Política de privacidade:</strong>{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://supabase.com/privacy
                  </a>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-base-content mt-4">
                4.4 Cloudflare (Estados Unidos / Global)
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados compartilhados:</strong> requisições HTTP
                  (endereço IP, cabeçalhos), dados de rate limiting;
                </li>
                <li>
                  <strong>Finalidade:</strong> hospedagem da aplicação
                  (Cloudflare Pages), execução do backend (Cloudflare Workers),
                  proteção contra abusos (rate limiting via Cloudflare KV);
                </li>
                <li>
                  <strong>Localização:</strong> rede global de data centers;
                </li>
                <li>
                  <strong>Política de privacidade:</strong>{" "}
                  <a
                    href="https://www.cloudflare.com/privacypolicy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://www.cloudflare.com/privacypolicy/
                  </a>
                </li>
              </ul>

              <p className="mt-4">
                A BBU Labs <strong>não vende, aluga ou comercializa</strong>{" "}
                dados pessoais dos usuários com terceiros para fins de
                marketing, publicidade ou qualquer outra finalidade não
                descrita nesta Política.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                5. Transferência Internacional de Dados
              </h2>
              <p>
                Os dados pessoais dos usuários podem ser transferidos e
                processados fora do Brasil, especificamente para:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>União Europeia (França):</strong> Mistral AI — região
                  considerada com nível adequado de proteção pela LGPD e pelo
                  GDPR;
                </li>
                <li>
                  <strong>Estados Unidos:</strong> ElevenLabs, Supabase e
                  Cloudflare — transferência baseada em cláusulas contratuais
                  padrão e compromissos de conformidade dos provedores.
                </li>
              </ul>
              <p>
                Nos termos do Art. 33 da LGPD, as transferências internacionais
                são realizadas com base em: (i) adequação do nível de proteção
                do país destinatário; (ii) cláusulas contratuais específicas;
                (iii) consentimento específico e em destaque do titular.
              </p>
              <p>
                Nos termos do Capítulo V do GDPR (Arts. 44-49), as
                transferências são amparadas por decisões de adequação ou
                cláusulas contratuais padrão adotadas pela Comissão Europeia.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                6. Retenção e Exclusão de Dados
              </h2>
              <p>
                Os dados pessoais são retidos conforme os seguintes critérios:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Dados de cadastro:</strong> mantidos enquanto a conta
                  estiver ativa;
                </li>
                <li>
                  <strong>Documentos enviados:</strong> armazenados enquanto a
                  conta estiver ativa. Ao excluir um documento, ele é marcado
                  como excluído (soft delete) e removido definitivamente em até
                  30 (trinta) dias;
                </li>
                <li>
                  <strong>Análises e histórico:</strong> mantidos enquanto a
                  conta estiver ativa, excluídos junto com a conta;
                </li>
                <li>
                  <strong>Áudios gerados:</strong> armazenados no Supabase
                  Storage enquanto a conta estiver ativa;
                </li>
                <li>
                  <strong>Dados agregados no ranking:</strong> dados anônimos e
                  agregados sobre abusividade de termos de empresas podem ser
                  mantidos indefinidamente, pois não contêm identificação
                  pessoal;
                </li>
                <li>
                  <strong>Links de compartilhamento:</strong> permanecem ativos
                  enquanto a análise existir. São invalidados quando a conta ou
                  análise é excluída.
                </li>
              </ul>
              <p className="mt-2">
                O usuário pode solicitar a exclusão de sua conta e de todos os
                seus dados pessoais a qualquer momento, conforme descrito na
                seção &ldquo;Direitos do Titular&rdquo;.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                7. Direitos do Titular dos Dados
              </h2>
              <p>
                Conforme a LGPD (Art. 18) e o GDPR (Arts. 15-22), o titular dos
                dados pessoais tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Confirmação e acesso:</strong> confirmar a existência
                  de tratamento e acessar seus dados pessoais;
                </li>
                <li>
                  <strong>Retificação:</strong> solicitar a correção de dados
                  incompletos, inexatos ou desatualizados;
                </li>
                <li>
                  <strong>Anonimização, bloqueio ou eliminação:</strong>{" "}
                  solicitar a anonimização, bloqueio ou eliminação de dados
                  desnecessários ou tratados em desconformidade;
                </li>
                <li>
                  <strong>Portabilidade:</strong> solicitar a portabilidade dos
                  dados a outro fornecedor de serviço (LGPD, Art. 18, V);
                </li>
                <li>
                  <strong>Eliminação:</strong> solicitar a eliminação dos dados
                  pessoais tratados com base em consentimento;
                </li>
                <li>
                  <strong>Informação sobre compartilhamento:</strong> ser
                  informado sobre as entidades públicas e privadas com as quais
                  os dados são compartilhados;
                </li>
                <li>
                  <strong>Revogação do consentimento:</strong> revogar o
                  consentimento a qualquer momento, sem afetar a licitude do
                  tratamento realizado anteriormente;
                </li>
                <li>
                  <strong>Oposição:</strong> opor-se ao tratamento baseado em
                  legítimo interesse, caso aplicável;
                </li>
                <li>
                  <strong>Reclamação à ANPD:</strong> apresentar reclamação à
                  Autoridade Nacional de Proteção de Dados (ANPD) —{" "}
                  <a
                    href="https://www.gov.br/anpd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.gov.br/anpd
                  </a>
                  ;
                </li>
                <li>
                  <strong>Reclamação à autoridade europeia (GDPR):</strong>{" "}
                  titulares na UE podem apresentar reclamação à autoridade de
                  proteção de dados de seu país.
                </li>
              </ul>
              <p className="mt-2">
                Para exercer qualquer um desses direitos, entre em contato pelo
                e-mail{" "}
                <a
                  href="mailto:contato@bbu.app.br"
                  className="text-primary hover:underline"
                >
                  contato@bbu.app.br
                </a>
                . Responderemos no prazo de 15 (quinze) dias úteis, conforme a
                LGPD (Art. 19, II), ou de 30 (trinta) dias, conforme o GDPR
                (Art. 12(3)).
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                8. Segurança dos Dados
              </h2>
              <p>
                A BBU Labs adota medidas técnicas e organizacionais adequadas
                para proteger os dados pessoais contra acesso não autorizado,
                destruição, perda, alteração ou qualquer forma de tratamento
                inadequado:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Criptografia em trânsito:</strong> todas as
                  comunicações entre o navegador do usuário e a Plataforma são
                  protegidas por HTTPS/TLS;
                </li>
                <li>
                  <strong>Criptografia de senhas:</strong> senhas são
                  armazenadas utilizando algoritmos de hash seguros
                  (bcrypt/argon2) pelo Supabase Auth;
                </li>
                <li>
                  <strong>Row Level Security (RLS):</strong> todas as tabelas do
                  banco de dados implementam políticas de RLS que garantem que
                  cada usuário acesse apenas seus próprios dados;
                </li>
                <li>
                  <strong>Autenticação por tokens:</strong> sessões gerenciadas
                  por JWT com expiração configurada;
                </li>
                <li>
                  <strong>Links de compartilhamento assinados:</strong> links
                  públicos de análise utilizam assinatura HMAC-SHA256 para
                  prevenir acesso não autorizado;
                </li>
                <li>
                  <strong>Rate limiting:</strong> proteção contra abuso por meio
                  de limitação de requisições via Cloudflare KV;
                </li>
                <li>
                  <strong>Isolamento de ambiente:</strong> variáveis de
                  ambiente sensíveis (chaves de API, segredos) são armazenadas
                  de forma segura e nunca expostas ao cliente.
                </li>
              </ul>
              <p className="mt-2">
                Apesar das medidas adotadas, nenhum sistema é completamente
                seguro. Em caso de incidente de segurança que possa acarretar
                risco ou dano relevante aos titulares, a BBU Labs notificará a
                ANPD e os usuários afetados conforme a LGPD (Art. 48) e o GDPR
                (Arts. 33-34).
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                9. Cookies e Tecnologias de Rastreamento
              </h2>
              <p>A Plataforma utiliza as seguintes tecnologias:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Cookies de sessão (essenciais):</strong> necessários
                  para manter a autenticação do usuário e o funcionamento da
                  Plataforma. Não podem ser desativados;
                </li>
                <li>
                  <strong>LocalStorage:</strong> utilizado para armazenar
                  preferências de acessibilidade (tamanho de fonte, alto
                  contraste) e dados temporários de navegação;
                </li>
                <li>
                  <strong>Tokens JWT:</strong> armazenados para manter a sessão
                  do usuário.
                </li>
              </ul>
              <p className="mt-2">
                A Plataforma <strong>não utiliza</strong> cookies de marketing,
                rastreamento publicitário, analytics de terceiros (Google
                Analytics, Meta Pixel ou similares) ou fingerprinting.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                10. Dados de Menores
              </h2>
              <p>
                A Plataforma não é destinada a menores de 18 (dezoito) anos.
                Não coletamos intencionalmente dados pessoais de crianças ou
                adolescentes. Caso tenhamos conhecimento de que dados de um
                menor foram coletados sem o consentimento do responsável legal,
                excluiremos tais dados imediatamente.
              </p>
              <p>
                Se você é responsável legal e acredita que seu filho forneceu
                dados pessoais à Plataforma, entre em contato pelo e-mail{" "}
                <a
                  href="mailto:contato@bbu.app.br"
                  className="text-primary hover:underline"
                >
                  contato@bbu.app.br
                </a>
                .
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                11. Tratamento Automatizado e Decisões Algorítmicas
              </h2>
              <p>
                A Plataforma utiliza inteligência artificial para processar
                documentos e gerar análises. O usuário tem direito a:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Informação:</strong> ser informado sobre a existência
                  de decisões automatizadas, incluindo a lógica utilizada (LGPD,
                  Art. 20);
                </li>
                <li>
                  <strong>Revisão:</strong> solicitar a revisão de decisões
                  tomadas unicamente com base em tratamento automatizado que
                  afetem seus interesses;
                </li>
                <li>
                  <strong>Explicação:</strong> obter informações claras e
                  adequadas sobre os critérios e procedimentos utilizados para a
                  decisão automatizada.
                </li>
              </ul>
              <p className="mt-2">
                As análises geradas pela IA têm caráter{" "}
                <strong>informativo e educacional</strong>, não constituindo
                parecer jurídico, e não produzem efeitos jurídicos vinculantes
                ao usuário.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                12. Funcionalidade de Compartilhamento Público
              </h2>
              <p>
                Ao utilizar a funcionalidade de compartilhamento de análises, o
                usuário deve estar ciente de que:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Um link público permanente será gerado contendo: título do
                  documento, tipo de documento, score de abusividade, resumo da
                  análise e cláusulas identificadas;
                </li>
                <li>
                  O link é acessível por qualquer pessoa que o possua,{" "}
                  <strong>sem necessidade de autenticação</strong>;
                </li>
                <li>
                  Dados de identificação pessoal do usuário (nome, e-mail){" "}
                  <strong>não são expostos</strong> no conteúdo compartilhado;
                </li>
                <li>
                  Uma vez compartilhado, o conteúdo pode ser copiado ou
                  redistribuído por terceiros — a BBU Labs não tem controle
                  sobre este uso;
                </li>
                <li>
                  A exclusão da conta ou da análise invalidará o link de
                  compartilhamento.
                </li>
              </ul>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                13. Ranking de Empresas
              </h2>
              <p>
                O ranking de empresas exibido na Plataforma é construído a
                partir de <strong>dados agregados e anônimos</strong>. Nenhum
                dado pessoal do usuário é exposto no ranking. As informações
                utilizadas incluem:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Nome da empresa cujos termos foram analisados (extraído
                  automaticamente do documento pela IA);
                </li>
                <li>Score médio de abusividade;</li>
                <li>Quantidade de análises realizadas;</li>
                <li>Data da última análise.</li>
              </ul>
              <p className="mt-2">
                O tratamento de dados para o ranking é baseado no legítimo
                interesse da BBU Labs em promover a transparência nas relações
                de consumo (LGPD, Art. 7º, IX).
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                14. Alterações nesta Política
              </h2>
              <p>
                A BBU Labs pode atualizar esta Política de Privacidade a
                qualquer momento. As alterações entrarão em vigor na data de
                sua publicação na Plataforma. O uso continuado da Plataforma
                após a publicação constitui aceitação da Política atualizada.
              </p>
              <p>
                Para alterações substanciais que afetem os direitos dos
                titulares, faremos esforços razoáveis para notificar os
                usuários por e-mail ou aviso na Plataforma com antecedência
                mínima de 15 (quinze) dias.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                15. Legislação Aplicável
              </h2>
              <p>Esta Política de Privacidade é regida por:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Lei Geral de Proteção de Dados (LGPD)</strong> — Lei
                  nº 13.709/2018, para usuários no Brasil;
                </li>
                <li>
                  <strong>
                    Regulamento Geral de Proteção de Dados (GDPR)
                  </strong>{" "}
                  — Regulamento (UE) 2016/679, para usuários na União Europeia
                  ou quando aplicável;
                </li>
                <li>
                  <strong>Marco Civil da Internet</strong> — Lei nº
                  12.965/2014, para disposições sobre registros de acesso e
                  guarda de dados;
                </li>
                <li>
                  <strong>Código de Defesa do Consumidor</strong> — Lei nº
                  8.078/1990, no que se refere às relações de consumo.
                </li>
              </ul>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                16. Contato e Encarregado de Dados (DPO)
              </h2>
              <p>
                Para dúvidas, solicitações ou reclamações relacionadas ao
                tratamento de dados pessoais, entre em contato:
              </p>
              <ul className="list-none pl-0 space-y-1">
                <li>
                  <strong>BBU Labs</strong>
                </li>
                <li>
                  <strong>Encarregado de Dados (DPO):</strong> Equipe BBU Labs
                </li>
                <li>
                  E-mail:{" "}
                  <a
                    href="mailto:contato@bbu.app.br"
                    className="text-primary hover:underline"
                  >
                    contato@bbu.app.br
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs text-base-content/50">
                Esta Política de Privacidade foi elaborada em conformidade com a
                LGPD e o GDPR, considerando as particularidades de um MVP
                desenvolvido em contexto de hackathon. A BBU Labs se compromete
                a revisar e atualizar esta Política à medida que o produto
                evolua.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
