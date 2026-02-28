/**
 * Demo data for InclusivAI — pre-analyzed examples for hackathon demo.
 *
 * Usage: These are meant to be cached in KV via `wrangler kv key put`
 * or seeded via the API after deploy.
 *
 * Run: npx tsx scripts/seed-demo.ts (requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 */

// ============================================================
// ToS Examples
// ============================================================

export const TOS_INSTAGRAM = {
  title: "Termos de Uso — Instagram (Meta)",
  doc_type: "termos_de_uso",
  company: "Instagram (Meta Platforms)",
  sample_text: `TERMOS DE USO DO INSTAGRAM

Bem-vindo ao Instagram! Estes Termos de Uso regem seu uso do Instagram e dos produtos, recursos, aplicativos, serviços, tecnologias e softwares que oferecemos, exceto quando declaramos expressamente que termos separados se aplicam.

1. LICENÇA DE CONTEÚDO
Ao compartilhar conteúdo no Instagram, você concede a nós uma licença não exclusiva, isenta de royalties, transferível, sublicenciável e válida mundialmente para hospedar, usar, distribuir, modificar, executar, copiar, exibir ou apresentar publicamente, traduzir e criar trabalhos derivados do seu conteúdo.

2. COLETA DE DADOS
Coletamos informações sobre suas atividades dentro e fora de nossos Produtos, incluindo: conteúdo que você cria, dados de localização, informações do dispositivo, dados de contatos, informações de parceiros terceiros.

3. LIMITAÇÃO DE RESPONSABILIDADE
NA MEDIDA MÁXIMA PERMITIDA PELA LEI APLICÁVEL, O INSTAGRAM NÃO SERÁ RESPONSÁVEL POR QUALQUER DANO INDIRETO, INCIDENTAL, ESPECIAL, CONSEQUENCIAL OU PUNITIVO, NEM POR QUALQUER PERDA DE LUCROS OU RECEITAS.

4. ALTERAÇÃO DOS TERMOS
Podemos alterar estes Termos a qualquer momento. Se fizermos alterações, notificaremos você. Se você continuar usando o Instagram após as alterações, concordará com os Termos revisados.

5. FORO
Qualquer reclamação relacionada a estes Termos será resolvida exclusivamente nos tribunais do Distrito do Norte da Califórnia, EUA.`,

  demo_analysis: {
    abusividade: 7.5,
    resumo:
      "Os Termos de Uso do Instagram apresentam várias cláusulas potencialmente abusivas ao consumidor brasileiro, incluindo licença ampla sobre conteúdo do usuário, coleta excessiva de dados e foro de eleição no exterior.",
    clausulas_abusivas: [
      {
        texto_original:
          "você concede a nós uma licença não exclusiva, isenta de royalties, transferível, sublicenciável e válida mundialmente para hospedar, usar, distribuir, modificar, executar, copiar, exibir ou apresentar publicamente, traduzir e criar trabalhos derivados do seu conteúdo",
        explicacao_simples:
          "O Instagram pode usar qualquer foto, vídeo ou texto que você postar da forma que quiser, sem te pagar nada, e ainda pode passar esse direito para outras empresas.",
        artigo_cdc: "Art. 51, IV do CDC — cláusulas que estabeleçam obrigações iníquas ou abusivas",
        gravidade: "alta",
      },
      {
        texto_original:
          "Coletamos informações sobre suas atividades dentro e fora de nossos Produtos",
        explicacao_simples:
          "O Instagram rastreia o que você faz não só dentro do app, mas também em outros sites e aplicativos, o que viola o princípio de minimização de dados da LGPD.",
        artigo_cdc: "Art. 6º, III da LGPD — princípio da necessidade",
        gravidade: "alta",
      },
      {
        texto_original:
          "O INSTAGRAM NÃO SERÁ RESPONSÁVEL POR QUALQUER DANO INDIRETO, INCIDENTAL, ESPECIAL",
        explicacao_simples:
          "O Instagram tenta se isentar de responsabilidade por danos que você possa sofrer usando o serviço. No Brasil, isso é considerado cláusula abusiva.",
        artigo_cdc: "Art. 51, I do CDC — impossibilitem, exonerem ou atenuem a responsabilidade do fornecedor",
        gravidade: "media",
      },
      {
        texto_original:
          "Qualquer reclamação será resolvida exclusivamente nos tribunais do Distrito do Norte da Califórnia, EUA",
        explicacao_simples:
          "Se você tiver problema com o Instagram, teria que processar nos EUA. Isso é ilegal no Brasil — você sempre pode processar no seu domicílio.",
        artigo_cdc: "Art. 51, VII do CDC — foro de eleição que dificulte a defesa do consumidor",
        gravidade: "alta",
      },
    ],
    pontos_positivos: [
      "O Instagram notifica sobre alterações nos termos",
      "Há opção de excluir a conta e os dados associados",
    ],
    recomendacao:
      "Use com cautela. Evite postar conteúdo sensível ou original de alto valor. Revise suas configurações de privacidade regularmente. Lembre-se que seus direitos como consumidor brasileiro são garantidos independente destes termos.",
  },
};

export const TOS_UBER = {
  title: "Termos de Uso — Uber",
  doc_type: "termos_de_uso",
  company: "Uber do Brasil Tecnologia",
  sample_text: `TERMOS E CONDIÇÕES GERAIS DE USO — UBER

1. RELAÇÃO CONTRATUAL
A Uber é uma plataforma tecnológica que conecta usuários a motoristas parceiros independentes. A Uber não presta serviço de transporte.

2. PREÇOS E COBRANÇA
Os preços são dinâmicos e podem variar de acordo com a demanda. Ao solicitar uma viagem, você concorda com o preço estimado, que pode ser maior que o valor final.

3. CANCELAMENTO
Cancelamentos após a aceitação do motorista podem incorrer em taxa. O valor da taxa é determinado pela Uber a seu exclusivo critério.

4. RESPONSABILIDADE
A Uber não se responsabiliza por atos, omissões ou qualidade do serviço prestado pelos motoristas parceiros.

5. ARBITRAGEM
Todas as disputas serão resolvidas por arbitragem vinculante, renunciando ao direito de participar de ações coletivas.`,

  demo_analysis: {
    abusividade: 6.8,
    resumo:
      "Os Termos da Uber tentam descaracterizar a relação de consumo e contêm cláusulas de arbitragem obrigatória e limitação de responsabilidade que conflitam com o CDC brasileiro.",
    clausulas_abusivas: [
      {
        texto_original: "A Uber não presta serviço de transporte",
        explicacao_simples:
          "A Uber tenta dizer que não é responsável pelo transporte, mas no Brasil a justiça já entendeu que ela é sim fornecedora de serviço de transporte.",
        artigo_cdc: "Art. 14 do CDC — responsabilidade objetiva do fornecedor",
        gravidade: "alta",
      },
      {
        texto_original: "O valor da taxa é determinado pela Uber a seu exclusivo critério",
        explicacao_simples:
          "A Uber pode cobrar o valor que quiser pelo cancelamento, sem critérios claros. Isso é considerado vantagem excessiva.",
        artigo_cdc: "Art. 51, IV do CDC — vantagem excessiva ao fornecedor",
        gravidade: "media",
      },
      {
        texto_original: "renunciando ao direito de participar de ações coletivas",
        explicacao_simples:
          "Você não pode renunciar ao direito de entrar com ação coletiva. Isso é um direito irrenunciável no Brasil.",
        artigo_cdc: "Art. 51, VII do CDC — cláusula que dificulte a defesa do consumidor",
        gravidade: "alta",
      },
    ],
    pontos_positivos: [
      "Oferece estimativa de preço antes da viagem",
      "Possui sistema de avaliação bidirecional",
    ],
    recomendacao:
      "O serviço é útil, mas esteja ciente de que seus direitos como consumidor são maiores do que esses termos sugerem. Em caso de problema, você pode reclamar no Procon ou Juizado Especial.",
  },
};

export const TOS_IFOOD = {
  title: "Termos de Uso — iFood",
  doc_type: "termos_de_uso",
  company: "iFood",
  sample_text: `TERMOS DE USO DA PLATAFORMA IFOOD

1. O iFood é uma plataforma de intermediação entre restaurantes e consumidores.

2. PEDIDOS: O prazo de entrega é estimado e pode variar. O iFood não garante a qualidade dos alimentos preparados pelos restaurantes parceiros.

3. CANCELAMENTO: Pedidos podem ser cancelados em até 5 minutos. Após o preparo, não há reembolso.

4. PROGRAMA DE FIDELIDADE: O iFood reserva-se o direito de alterar, suspender ou encerrar o programa de pontos a qualquer momento, sem aviso prévio.

5. DADOS: Seus dados de localização, pedidos e preferências são coletados para personalização de ofertas e compartilhados com parceiros comerciais.`,

  demo_analysis: {
    abusividade: 5.2,
    resumo:
      "Os Termos do iFood possuem cláusulas moderadamente abusivas, principalmente na limitação de responsabilidade pela qualidade dos alimentos e no compartilhamento de dados.",
    clausulas_abusivas: [
      {
        texto_original: "O iFood não garante a qualidade dos alimentos preparados pelos restaurantes parceiros",
        explicacao_simples:
          "O iFood tenta se isentar de responsabilidade pela comida, mas como intermediador, tem responsabilidade solidária pela qualidade.",
        artigo_cdc: "Art. 18 do CDC — responsabilidade solidária por vício do produto",
        gravidade: "media",
      },
      {
        texto_original: "Após o preparo, não há reembolso",
        explicacao_simples:
          "Negar reembolso após o preparo é abusivo se o produto chegou com defeito ou diferente do anunciado.",
        artigo_cdc: "Art. 49 do CDC — direito de arrependimento",
        gravidade: "media",
      },
      {
        texto_original: "alterar, suspender ou encerrar o programa de pontos a qualquer momento, sem aviso prévio",
        explicacao_simples:
          "Alterar regras sem aviso prévio pode prejudicar consumidores que acumularam pontos.",
        artigo_cdc: "Art. 51, XIII do CDC — modificação unilateral do contrato",
        gravidade: "baixa",
      },
    ],
    pontos_positivos: [
      "Permite cancelamento em até 5 minutos",
      "Sistema de avaliação de restaurantes",
      "Rastreamento do pedido em tempo real",
    ],
    recomendacao:
      "O iFood é geralmente confiável, mas sempre tire prints dos pedidos e guarde comprovantes. Em caso de alimento estragado ou pedido errado, exija reembolso — é seu direito.",
  },
};

export const TOS_NUBANK = {
  title: "Termos de Uso — Nubank",
  doc_type: "termos_de_uso",
  company: "Nu Pagamentos S.A. (Nubank)",
  sample_text: `TERMOS DE USO NUBANK

1. CONTA DIGITAL: A conta é gratuita e sem taxa de manutenção. Movimentações são registradas e disponibilizadas no aplicativo.

2. CARTÃO DE CRÉDITO: O limite é definido com base em análise de crédito e pode ser ajustado. Cobranças de juros seguem as taxas divulgadas pelo Banco Central.

3. SEGURANÇA: Em caso de transação não reconhecida, o cliente deve notificar em até 48 horas. O Nubank investigará e poderá estornar o valor.

4. PRIVACIDADE: Dados são coletados e tratados conforme a LGPD. O compartilhamento com terceiros ocorre apenas quando necessário para operação dos serviços ou por obrigação legal.

5. ENCERRAMENTO: O Nubank pode encerrar a conta a qualquer momento, mediante aviso prévio de 30 dias, sem necessidade de justificativa.`,

  demo_analysis: {
    abusividade: 3.2,
    resumo:
      "Os Termos do Nubank são relativamente equilibrados e demonstram boa aderência ao CDC e LGPD, com destaque para a gratuidade da conta e transparência nas taxas.",
    clausulas_abusivas: [
      {
        texto_original: "O Nubank pode encerrar a conta a qualquer momento, mediante aviso prévio de 30 dias, sem necessidade de justificativa",
        explicacao_simples:
          "O banco pode fechar sua conta sem explicar o motivo. Embora dê 30 dias de aviso, a falta de justificativa pode ser questionável.",
        artigo_cdc: "Art. 51, XI do CDC — autorizar o fornecedor a cancelar o contrato unilateralmente",
        gravidade: "media",
      },
    ],
    pontos_positivos: [
      "Conta gratuita sem taxa de manutenção",
      "Transparência nas taxas de juros",
      "Prazo razoável para contestar transações",
      "Conformidade declarada com a LGPD",
      "Aviso prévio de 30 dias para encerramento",
    ],
    recomendacao:
      "Os termos do Nubank estão entre os mais justos do mercado financeiro brasileiro. Recomendamos o uso, mas fique atento à cláusula de encerramento unilateral.",
  },
};

export const TOS_SHEIN = {
  title: "Termos de Uso — Shein",
  doc_type: "termos_de_uso",
  company: "Shein",
  sample_text: `TERMOS E CONDIÇÕES — SHEIN

1. COMPRAS INTERNACIONAIS: Os produtos são enviados do exterior. Impostos e taxas de importação são de responsabilidade do comprador.

2. DEVOLUÇÃO: Devoluções devem ser solicitadas em até 7 dias após o recebimento. O frete de devolução internacional é por conta do consumidor. Itens de vestuário íntimo não podem ser devolvidos.

3. QUALIDADE: As cores e tamanhos podem variar em relação às fotos do site. A Shein não garante conformidade exata com as imagens.

4. DADOS: Ao criar uma conta, você autoriza o compartilhamento de seus dados com empresas do grupo Shein em qualquer país, independente da legislação local de proteção de dados.

5. FORO: Eventuais disputas serão regidas pelas leis de Hong Kong.`,

  demo_analysis: {
    abusividade: 8.3,
    resumo:
      "Os Termos da Shein são altamente abusivos para o consumidor brasileiro, com cláusulas que violam o CDC, LGPD e normas de importação.",
    clausulas_abusivas: [
      {
        texto_original: "O frete de devolução internacional é por conta do consumidor",
        explicacao_simples:
          "Se o produto veio com defeito, quem vende é que tem que pagar a devolução. Cobrar frete internacional de devolução do consumidor é abusivo.",
        artigo_cdc: "Art. 18, § 1º do CDC — responsabilidade do fornecedor por vícios",
        gravidade: "alta",
      },
      {
        texto_original: "A Shein não garante conformidade exata com as imagens",
        explicacao_simples:
          "Se o produto é diferente da foto, é propaganda enganosa. Você tem direito de devolver e receber o dinheiro de volta.",
        artigo_cdc: "Art. 37 do CDC — publicidade enganosa",
        gravidade: "alta",
      },
      {
        texto_original: "você autoriza o compartilhamento de seus dados com empresas do grupo Shein em qualquer país, independente da legislação local",
        explicacao_simples:
          "Seus dados pessoais podem ser enviados para qualquer país sem proteção. Isso viola a LGPD que exige garantias para transferência internacional.",
        artigo_cdc: "Art. 33 da LGPD — transferência internacional de dados",
        gravidade: "alta",
      },
      {
        texto_original: "disputas serão regidas pelas leis de Hong Kong",
        explicacao_simples:
          "Se vende para brasileiros, tem que respeitar a lei brasileira. Escolher a lei de Hong Kong é abusivo.",
        artigo_cdc: "Art. 51, VII do CDC — foro de eleição abusivo",
        gravidade: "alta",
      },
    ],
    pontos_positivos: ["Preços acessíveis", "Ampla variedade de produtos"],
    recomendacao:
      "Compre com extrema cautela. Guarde todos os comprovantes. Em caso de problema, reclame no Procon — seus direitos como consumidor brasileiro se aplicam independente desses termos.",
  },
};

// ============================================================
// Scam Examples
// ============================================================

export const SCAM_WHATSAPP_PIX = {
  title: "Golpe do Pix via WhatsApp",
  doc_type: "mensagem_suspeita",
  sample_text: `🚨 URGENTE! Seu Pix de R$ 3.500,00 foi agendado com sucesso. Se você NÃO reconhece essa transação, clique AGORA no link abaixo para cancelar:

👉 http://cancelar-pix-seguro.xyz/auth

Você tem apenas 30 MINUTOS para cancelar antes que o valor seja debitado da sua conta. Central de Segurança Banco do Brasil.`,

  demo_analysis: {
    classificacao: "golpe_provavel",
    confianca: 95,
    sinais_alerta: [
      "Urgência falsa — pressão para agir em 30 minutos",
      "Link suspeito com domínio não oficial (.xyz)",
      "Bancos nunca enviam links por WhatsApp para cancelar Pix",
      "Uso de emoji e formatação para parecer oficial",
      "Não identifica agência ou conta do cliente",
    ],
    explicacao:
      "Esta é uma tentativa clássica de phishing. O golpista se passa pelo Banco do Brasil para fazer você clicar em um link falso e roubar seus dados bancários. Bancos nunca pedem que você clique em links por WhatsApp.",
    acao_recomendada:
      "NÃO clique no link. Bloqueie o número. Acesse seu banco apenas pelo app oficial ou site digitando o endereço manualmente.",
    onde_denunciar: [
      { orgao: "Banco do Brasil", como: "Ligue para a central oficial", contato: "4004-0001" },
      { orgao: "Procon", como: "Registre reclamação online", contato: "www.procon.sp.gov.br" },
      { orgao: "Polícia Civil", como: "Delegacia de crimes cibernéticos", contato: "Registre B.O. online no site da PC do seu estado" },
      { orgao: "SaferNet Brasil", como: "Denúncia online", contato: "www.safernet.org.br/denuncie" },
    ],
  },
};

export const SCAM_FAKE_PROMO = {
  title: "Golpe de promoção falsa",
  doc_type: "mensagem_suspeita",
  sample_text: `PARABÉNS! 🎉 Você foi selecionado(a) para receber um iPhone 15 Pro GRÁTIS! A Magazine Luiza está comemorando 30 anos e escolheu VOCÊ entre milhões de clientes.

Para resgatar seu prêmio, basta:
1. Compartilhar esta mensagem com 10 grupos
2. Preencher seus dados em: http://magazineluiza-premios.com/resgate
3. Pagar apenas o frete de R$ 49,90 via Pix

Corra! Restam apenas 15 unidades! ⏰`,

  demo_analysis: {
    classificacao: "golpe_provavel",
    confianca: 98,
    sinais_alerta: [
      "Prêmio gratuito sem participação em promoção",
      "Pedido para compartilhar com grupos (disseminação viral)",
      "Site com domínio falso (não é o oficial da Magazine Luiza)",
      "Cobrança de frete para prêmio supostamente gratuito",
      "Senso de urgência artificial ('restam apenas 15 unidades')",
    ],
    explicacao:
      "Este é um golpe clássico de phishing com promoção falsa. A Magazine Luiza nunca distribui prêmios por WhatsApp. O objetivo é coletar seus dados pessoais e o pagamento do falso frete.",
    acao_recomendada:
      "Não compartilhe, não clique no link e não faça nenhum pagamento. Avise quem te enviou que é golpe.",
    onde_denunciar: [
      { orgao: "Magazine Luiza", como: "Canal oficial para denunciar uso indevido da marca", contato: "SAC 0800 310 0002" },
      { orgao: "Procon", como: "Registre reclamação", contato: "151 ou Procon do seu estado" },
      { orgao: "SaferNet Brasil", como: "Denúncia online", contato: "www.safernet.org.br/denuncie" },
    ],
  },
};

// ============================================================
// General Document Examples
// ============================================================

export const DOC_INSS_LETTER = {
  title: "Carta do INSS — Indeferimento de Benefício",
  doc_type: "carta_inss",
  sample_text: `INSTITUTO NACIONAL DO SEGURO SOCIAL — INSS
Gerência Executiva de São Paulo

COMUNICAÇÃO DE DECISÃO

Protocolo: 2024.123.456.789
Benefício: Aposentadoria por Tempo de Contribuição
Requerente: [NOME DO SEGURADO]
CPF: [CPF]
NIT: [NIT]

Comunicamos que seu requerimento de APOSENTADORIA POR TEMPO DE CONTRIBUIÇÃO foi INDEFERIDO pelo seguinte motivo:

MOTIVO: Tempo de contribuição insuficiente. Foi apurado o tempo de 32 anos, 4 meses e 15 dias. O tempo mínimo exigido é de 35 anos para homens.

Você pode interpor RECURSO à Junta de Recursos do CRPS no prazo de 30 (trinta) dias a contar do recebimento desta comunicação.

Local do recurso: Junta de Recursos do CRPS
Endereço: Rua Augusta, 1000, São Paulo/SP

São Paulo, 15 de janeiro de 2024.`,

  demo_analysis: {
    resumo_executivo:
      "O INSS negou seu pedido de aposentadoria porque faltam 2 anos, 7 meses e 15 dias de contribuição. Você tem 30 dias para recorrer.",
    pontos_criticos: [
      {
        item: "Benefício indeferido",
        explicacao: "O INSS disse que você tem 32 anos e 4 meses de contribuição, mas precisa de 35 anos",
        urgencia: "alta",
      },
      {
        item: "Prazo de recurso: 30 dias",
        explicacao: "Você tem 30 dias a partir de quando recebeu esta carta para recorrer. Não perca este prazo!",
        urgencia: "alta",
      },
    ],
    acoes_recomendadas: [
      {
        acao: "Verifique seu CNIS (extrato de contribuições)",
        prazo: "Imediatamente",
        como_fazer: "Acesse Meu INSS (app ou site gov.br) e baixe o extrato. Verifique se todos os empregos estão registrados.",
      },
      {
        acao: "Entre com recurso",
        prazo: "Até 30 dias após recebimento",
        como_fazer: "Vá à Junta de Recursos do CRPS (Rua Augusta, 1000, SP) com documentos que comprovem contribuições não computadas.",
      },
      {
        acao: "Consulte um advogado previdenciário",
        prazo: "O mais breve possível",
        como_fazer: "Procure a Defensoria Pública ou um advogado especializado. Muitos fazem consulta gratuita.",
      },
    ],
    prazos: [
      {
        descricao: "Recurso administrativo",
        data_limite: "30 dias após recebimento da carta",
        consequencia: "Perda do direito de recorrer na esfera administrativa",
      },
    ],
    base_legal: [
      { lei: "Lei 8.213/91", artigo: "Art. 56", relevancia: "Define tempo mínimo de contribuição para aposentadoria" },
      { lei: "Lei 8.213/91", artigo: "Art. 126", relevancia: "Direito de recurso ao CRPS" },
    ],
  },
};

export const DOC_JUDICIAL = {
  title: "Intimação Judicial — Cobrança Indevida",
  doc_type: "notificacao_judicial",
  sample_text: `PODER JUDICIÁRIO
TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO
3ª Vara Cível do Foro Central

INTIMAÇÃO

Processo nº 1234567-89.2024.8.26.0100
Classe: Procedimento Comum
Autor: [NOME DA EMPRESA DE TELEFONIA]
Réu: [NOME DO CONSUMIDOR]

Fica V.Sa. INTIMADO(A) para, no prazo de 15 (quinze) dias, apresentar CONTESTAÇÃO à ação de cobrança movida por [EMPRESA DE TELEFONIA], no valor de R$ 2.340,00, referente a faturas dos meses de março a agosto de 2024.

Caso não apresente contestação no prazo, serão presumidos verdadeiros os fatos alegados pelo autor (revelia).

São Paulo, 10 de fevereiro de 2024.
Escrivã Judicial`,

  demo_analysis: {
    resumo_executivo:
      "Uma empresa de telefonia está cobrando R$ 2.340,00 de você na Justiça. Você TEM que responder em 15 dias ou pode perder automaticamente.",
    pontos_criticos: [
      {
        item: "Ação de cobrança de R$ 2.340,00",
        explicacao: "Uma empresa de telefonia diz que você deve R$ 2.340,00 em faturas de março a agosto de 2024",
        urgencia: "alta",
      },
      {
        item: "Prazo de 15 dias para contestar",
        explicacao: "Se você não responder em 15 dias, o juiz pode decidir que você realmente deve e mandar pagar",
        urgencia: "alta",
      },
    ],
    acoes_recomendadas: [
      {
        acao: "Verifique se as cobranças são legítimas",
        prazo: "Imediatamente",
        como_fazer: "Acesse o site da operadora e verifique suas faturas. Guarde prints de tudo.",
      },
      {
        acao: "Procure a Defensoria Pública ou advogado",
        prazo: "Nos próximos 2-3 dias",
        como_fazer: "A Defensoria Pública atende gratuitamente. Leve a intimação e todos os comprovantes.",
      },
      {
        acao: "Apresente contestação",
        prazo: "Até 15 dias",
        como_fazer: "Com a ajuda de advogado, apresente contestação no processo. Se a cobrança for indevida, peça danos morais.",
      },
    ],
    prazos: [
      {
        descricao: "Contestação",
        data_limite: "15 dias a partir da intimação",
        consequencia: "Revelia — os fatos alegados pela empresa são presumidos verdadeiros",
      },
    ],
    base_legal: [
      { lei: "CPC", artigo: "Art. 344", relevancia: "Efeitos da revelia" },
      { lei: "CDC", artigo: "Art. 42", relevancia: "Proibição de cobrança abusiva" },
      { lei: "CDC", artigo: "Art. 42, parágrafo único", relevancia: "Repetição do indébito em dobro" },
    ],
  },
};

// ============================================================
// All demo entries for seeding
// ============================================================

export const ALL_DEMOS = {
  tos: [TOS_INSTAGRAM, TOS_UBER, TOS_IFOOD, TOS_NUBANK, TOS_SHEIN],
  scam: [SCAM_WHATSAPP_PIX, SCAM_FAKE_PROMO],
  general: [DOC_INSS_LETTER, DOC_JUDICIAL],
};
