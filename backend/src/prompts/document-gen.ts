export const DOC_GEN_TYPES = [
  "carta_reclamacao_procon",
  "peticao_juizado_especial",
  "script_sac",
] as const;

export type DocGenType = (typeof DOC_GEN_TYPES)[number];

export const DOC_GEN_SYSTEM_PROMPT = `Você é um advogado especialista em direito do consumidor brasileiro. Sua tarefa é gerar documentos jurídicos baseados nas informações fornecidas.

Regras:
1. SEMPRE retorne JSON válido com a estrutura: { "documento": "...", "tipo": "...", "instrucoes": "..." }
2. O campo "documento" deve conter o texto completo do documento, formatado e pronto para uso
3. Use [PREENCHER] como marcador para dados que o consumidor precisa completar
4. Cite artigos específicos do CDC (Lei 8.078/90) quando aplicável
5. Use linguagem formal e juridicamente correta
6. O campo "instrucoes" deve explicar como usar o documento gerado`;

export const DOC_GEN_PROMPTS: Record<DocGenType, string> = {
  carta_reclamacao_procon: `Gere uma carta de reclamação formal para o Procon com base nos dados fornecidos.

A carta deve incluir:
- Cabeçalho com identificação do consumidor e da empresa
- Descrição detalhada do problema
- Fundamentação legal (artigos do CDC)
- Pedido específico (reembolso, troca, reparo, etc.)
- Prazo para resposta
- Assinatura e data

Formato: carta formal para protocolo no Procon.`,

  peticao_juizado_especial: `Gere uma petição inicial para o Juizado Especial Cível (causas até 40 salários mínimos, sem advogado necessário).

A petição deve incluir:
- Endereçamento ao Juizado Especial Cível da comarca
- Qualificação completa do autor (consumidor)
- Qualificação do réu (empresa)
- Dos fatos: narrativa cronológica do ocorrido
- Do direito: fundamentação legal com artigos do CDC, CC e CF
- Dos pedidos: indenização por danos materiais e/ou morais, com valores
- Provas que pretende produzir
- Valor da causa
- Requerimentos finais

Formato: petição jurídica formal.`,

  script_sac: `Gere um roteiro/script para ligação ao SAC (Serviço de Atendimento ao Consumidor).

O script deve incluir:
- O que dizer na abertura da ligação
- Dados que precisa ter em mãos antes de ligar
- Como descrever o problema de forma clara
- Perguntas importantes para fazer ao atendente
- Como solicitar o número de protocolo
- O que fazer se não resolver na ligação
- Direitos do consumidor no atendimento (Decreto 6.523/08)
- Como escalar para ouvidoria

Formato: roteiro passo a passo, conversacional.`,
};

export const DOC_GEN_USER_PROMPT = (
  type: DocGenType,
  consumerData: {
    nome?: string;
    cpf?: string;
    empresa: string;
    problema: string;
    data_ocorrencia?: string;
    valor?: string;
    tentativas_anteriores?: string;
    pedido?: string;
  },
  analysisContext?: string
) => {
  const typePrompt = DOC_GEN_PROMPTS[type];
  const contextSection = analysisContext
    ? `\n## Contexto da análise realizada:\n${analysisContext}\n`
    : "";

  return `${typePrompt}
${contextSection}
## Dados do consumidor:
- Nome: ${consumerData.nome || "[PREENCHER]"}
- CPF: ${consumerData.cpf || "[PREENCHER]"}

## Dados da empresa:
- Empresa: ${consumerData.empresa}

## Descrição do problema:
${consumerData.problema}

## Data da ocorrência: ${consumerData.data_ocorrencia || "[PREENCHER]"}
## Valor envolvido: ${consumerData.valor || "Não informado"}
## Tentativas anteriores de solução: ${consumerData.tentativas_anteriores || "Nenhuma"}
## O que o consumidor deseja: ${consumerData.pedido || "Resolução do problema"}`;
};
