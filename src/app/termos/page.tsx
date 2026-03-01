"use client";

import Navbar from "@/components/Navbar";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-2">Termos de Uso</h1>
          <p className="text-sm text-base-content/50 mb-10">
            Última atualização: 28 de fevereiro de 2026
          </p>

          <div className="prose prose-sm max-w-none text-base-content/80 space-y-8">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                1. Sobre a Plataforma e a BBU Labs
              </h2>
              <p>
                A plataforma <strong>Cláusula Oculta</strong> (&ldquo;Plataforma&rdquo;) é
                desenvolvida e operada pela <strong>BBU Labs</strong>, um coletivo
                independente de desenvolvedores de software. Este produto foi concebido
                como um <strong>MVP (Minimum Viable Product)</strong> no contexto do{" "}
                <strong>Mistral AI Worldwide Hackathon</strong> e tem caráter{" "}
                <strong>experimental e educacional</strong>.
              </p>
              <p>
                A BBU Labs não é um escritório de advocacia, não presta consultoria
                jurídica e não substitui o aconselhamento de um advogado. A Plataforma
                utiliza inteligência artificial para simplificar a linguagem de
                documentos jurídicos e oficiais, mas os resultados gerados{" "}
                <strong>não constituem parecer jurídico, opinião legal ou recomendação profissional</strong>.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                2. Aceitação dos Termos
              </h2>
              <p>
                Ao criar uma conta na Plataforma, você declara que leu, compreendeu e
                concorda integralmente com estes Termos de Uso e com a nossa{" "}
                <a href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
                . Caso não concorde com qualquer disposição, não utilize a Plataforma.
              </p>
              <p>
                Você declara ter pelo menos 18 (dezoito) anos de idade ou possuir
                autorização de seu responsável legal para utilizar a Plataforma.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                3. Descrição do Serviço
              </h2>
              <p>A Plataforma oferece as seguintes funcionalidades:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Análise de documentos:</strong> envio de documentos jurídicos
                  ou oficiais (por URL, foto ou upload) para simplificação da linguagem
                  por inteligência artificial;
                </li>
                <li>
                  <strong>Detecção de cláusulas abusivas:</strong> identificação
                  automatizada de cláusulas potencialmente abusivas em contratos e termos
                  de uso, com referência a artigos do Código de Defesa do Consumidor
                  (CDC) e da Lei Geral de Proteção de Dados (LGPD);
                </li>
                <li>
                  <strong>Detecção de golpes:</strong> análise de mensagens suspeitas
                  para identificar possíveis fraudes;
                </li>
                <li>
                  <strong>Geração de áudio:</strong> conversão dos resultados da análise
                  em áudio para acessibilidade;
                </li>
                <li>
                  <strong>Ranking de empresas:</strong> exibição agregada e anônima das
                  notas de abusividade de termos de uso de empresas;
                </li>
                <li>
                  <strong>Compartilhamento:</strong> geração de links públicos para
                  compartilhar resultados de análise;
                </li>
                <li>
                  <strong>Perguntas e respostas:</strong> interação com IA para
                  esclarecer dúvidas sobre o documento analisado.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                4. Conta do Usuário
              </h2>
              <p>
                Para utilizar os serviços, é necessário criar uma conta fornecendo um
                endereço de e-mail válido e uma senha. Você é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter a confidencialidade de suas credenciais de acesso;</li>
                <li>
                  Todas as atividades realizadas em sua conta, ainda que por terceiros;
                </li>
                <li>
                  Notificar imediatamente a BBU Labs sobre qualquer uso não autorizado
                  de sua conta.
                </li>
              </ul>
              <p>
                A BBU Labs reserva-se o direito de suspender ou encerrar contas que
                violem estes Termos, sem aviso prévio.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                5. Uso de Inteligência Artificial
              </h2>
              <p>
                Os resultados gerados pela Plataforma são produzidos por modelos de
                inteligência artificial fornecidos pela <strong>Mistral AI</strong>{" "}
                (análise de texto, OCR e geração de conteúdo) e pela{" "}
                <strong>ElevenLabs</strong> (geração de áudio). Você reconhece e aceita
                que:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Os resultados da IA podem conter <strong>imprecisões, erros ou
                  omissões</strong> — a tecnologia possui limitações inerentes;
                </li>
                <li>
                  As análises <strong>não substituem</strong> a opinião de um advogado
                  ou profissional qualificado;
                </li>
                <li>
                  O conteúdo textual dos documentos enviados é transmitido aos servidores
                  da Mistral AI para processamento. A Mistral AI é uma empresa sediada na{" "}
                  <strong>União Europeia (França)</strong> e está sujeita ao GDPR;
                </li>
                <li>
                  Resumos textuais podem ser transmitidos à ElevenLabs (sediada nos{" "}
                  <strong>Estados Unidos</strong>) para geração de áudio;
                </li>
                <li>
                  A BBU Labs não tem controle sobre o processamento interno realizado por
                  estes provedores de IA e recomenda que o usuário consulte as políticas
                  de privacidade da{" "}
                  <a
                    href="https://mistral.ai/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Mistral AI
                  </a>{" "}
                  e da{" "}
                  <a
                    href="https://elevenlabs.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ElevenLabs
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                6. Limitação de Responsabilidade
              </h2>
              <p>
                <strong>
                  A Plataforma é fornecida &ldquo;como está&rdquo; (as is) e &ldquo;conforme
                  disponibilidade&rdquo; (as available), sem garantias de qualquer
                  natureza, expressas ou implícitas.
                </strong>
              </p>
              <p>A BBU Labs <strong>não se responsabiliza</strong> por:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Decisões tomadas pelo usuário com base nos resultados das análises;
                </li>
                <li>
                  Danos diretos, indiretos, incidentais, consequenciais ou punitivos
                  decorrentes do uso ou da impossibilidade de uso da Plataforma;
                </li>
                <li>
                  Perdas financeiras, processuais ou de qualquer natureza oriundas da
                  confiança nos resultados gerados pela IA;
                </li>
                <li>
                  Indisponibilidade, interrupções, erros ou falhas da Plataforma ou de
                  serviços de terceiros;
                </li>
                <li>
                  Atos de terceiros, incluindo acesso não autorizado à conta do usuário;
                </li>
                <li>
                  Processamento de dados realizado pelos provedores de IA (Mistral AI,
                  ElevenLabs) após a transmissão dos dados pela Plataforma.
                </li>
              </ul>
              <p>
                O usuário reconhece que a Plataforma é um <strong>MVP experimental</strong>{" "}
                desenvolvido em contexto de hackathon e que pode apresentar instabilidades,
                bugs e limitações.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                7. Propriedade Intelectual
              </h2>
              <p>
                Todo o código-fonte, design, marcas, logotipos e conteúdo da Plataforma
                são de propriedade da BBU Labs ou licenciados para uso.
              </p>
              <p>
                Os documentos enviados pelo usuário permanecem de sua propriedade. Ao
                enviar um documento, o usuário concede à BBU Labs uma licença limitada,
                não exclusiva e revogável para processar o conteúdo com a finalidade
                exclusiva de prestar o serviço de análise.
              </p>
              <p>
                Os resultados das análises (textos simplificados, scores, recomendações)
                são gerados pela IA e podem ser livremente utilizados pelo usuário para
                fins pessoais.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                8. Limites de Uso
              </h2>
              <p>A Plataforma impõe os seguintes limites por plano:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Plano Gratuito:</strong> 10 análises/mês, 5 gerações de
                  áudio/mês, 5 perguntas/dia por documento, 3 documentos legais/mês;
                </li>
                <li>
                  <strong>Plano Premium:</strong> 100 análises/mês com limites
                  proporcionais;
                </li>
                <li>Upload de arquivos limitado a 5 MB por documento.</li>
              </ul>
              <p>É vedado ao usuário:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Utilizar a Plataforma para fins ilegais ou que violem direitos de
                  terceiros;
                </li>
                <li>
                  Enviar documentos que contenham conteúdo ilícito, difamatório ou que
                  viole direitos autorais de terceiros;
                </li>
                <li>
                  Tentar acessar áreas restritas, sistemas ou dados de outros usuários;
                </li>
                <li>
                  Automatizar o acesso à Plataforma (scraping, bots) sem autorização
                  prévia;
                </li>
                <li>
                  Revender, sublicenciar ou redistribuir o serviço sem autorização.
                </li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                9. Compartilhamento Público de Análises
              </h2>
              <p>
                Ao utilizar a funcionalidade de compartilhamento, o usuário concorda que:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Um link público será gerado contendo o título do documento, tipo,
                  score de abusividade e resumo da análise;
                </li>
                <li>
                  Este link é <strong>permanente</strong> e acessível por qualquer pessoa
                  que o possua, sem necessidade de autenticação;
                </li>
                <li>
                  Dados pessoais do usuário (nome, e-mail) <strong>não são expostos</strong>{" "}
                  no link compartilhado;
                </li>
                <li>
                  O ranking de empresas utiliza dados agregados e anônimos, sem
                  identificação dos usuários que realizaram as análises.
                </li>
              </ul>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                10. Exclusão de Dados e Encerramento de Conta
              </h2>
              <p>
                O usuário pode solicitar a exclusão de sua conta e dados pessoais a
                qualquer momento, entrando em contato pelo e-mail{" "}
                <a
                  href="mailto:contato@bbu.app.br"
                  className="text-primary hover:underline"
                >
                  contato@bbu.app.br
                </a>
                . Ao solicitar a exclusão:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>A conta será desativada e os dados pessoais serão removidos;</li>
                <li>
                  Documentos enviados e análises serão excluídos em até 30 (trinta) dias;
                </li>
                <li>
                  Dados agregados e anônimos no ranking de empresas poderão ser mantidos,
                  pois não contêm identificação pessoal;
                </li>
                <li>
                  Links de compartilhamento previamente gerados deixarão de funcionar.
                </li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                11. Alterações nos Termos
              </h2>
              <p>
                A BBU Labs pode alterar estes Termos a qualquer momento. As alterações
                entrarão em vigor na data de sua publicação na Plataforma. O uso
                continuado da Plataforma após a publicação de alterações constitui
                aceitação dos novos Termos.
              </p>
              <p>
                Para alterações materiais, faremos esforços razoáveis para notificar os
                usuários por e-mail ou aviso na Plataforma.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                12. Legislação Aplicável e Foro
              </h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil.
                Fica eleito o foro da Comarca do domicílio do usuário para dirimir
                quaisquer controvérsias, conforme o artigo 101, inciso I, do Código de
                Defesa do Consumidor (Lei nº 8.078/90).
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-bold text-base-content">
                13. Contato
              </h2>
              <p>
                Para dúvidas, sugestões ou solicitações relacionadas a estes Termos,
                entre em contato:
              </p>
              <ul className="list-none pl-0 space-y-1">
                <li>
                  <strong>BBU Labs</strong>
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
