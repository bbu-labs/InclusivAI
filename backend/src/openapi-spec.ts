import {
  AGE_RANGES,
  EDUCATION_LEVELS,
  DOC_TYPES,
  SIMPLIFICATION_LEVELS,
  ANALYSIS_TYPES,
  PREFERRED_OUTPUTS,
} from "./types";

const enumArray = (arr: readonly string[]) => ({ type: "string" as const, enum: [...arr] });

const errorResponse = (description: string) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object" as const,
        properties: {
          error: { type: "string" },
          detail: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["error"],
      },
    },
  },
});

const bearerAuth = [{ BearerAuth: [] }];

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "InclusivAI API",
    version: "0.1.0",
    description:
      "API para análise de documentos legais com linguagem simplificada, detecção de golpes e geração de áudio. Democratizando o acesso à informação jurídica no Brasil.",
  },
  servers: [
    { url: "https://inclusive-api.bbu.app.br", description: "Production" },
    { url: "http://localhost:8787", description: "Local development" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Supabase JWT token from /api/auth/login",
      },
    },
    schemas: {
      Profile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          full_name: { type: "string", nullable: true },
          age_range: { ...enumArray(AGE_RANGES), nullable: true },
          education_level: { ...enumArray(EDUCATION_LEVELS), nullable: true },
          preferred_output: { ...enumArray(PREFERRED_OUTPUTS), nullable: true },
          font_size: { type: "integer", minimum: 12, maximum: 32 },
          high_contrast: { type: "boolean" },
          plan: { type: "string", enum: ["free", "premium"] },
          analyses_this_month: { type: "integer" },
          month_reset_at: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Document: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          doc_type: { ...enumArray(DOC_TYPES), nullable: true },
          source_type: { type: "string", enum: ["text_input", "pdf_upload", "image_upload"] },
          file_path: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Analysis: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          document_id: { type: "string", format: "uuid" },
          user_id: { type: "string", format: "uuid" },
          analysis_type: enumArray(ANALYSIS_TYPES),
          simplification_level: enumArray(SIMPLIFICATION_LEVELS),
          summary: {
            type: "object",
            properties: {
              resumo: { type: "string" },
              resumo_executivo: { type: "string" },
              explicacao: { type: "string" },
              recomendacao: { type: "string" },
              acao_recomendada: { type: "string" },
              pontos_criticos: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item: { type: "string" },
                    explicacao: { type: "string" },
                  },
                },
              },
            },
          },
          abuse_score: { type: "number", minimum: 0, maximum: 10, nullable: true },
          audio_url: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Question: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          question: { type: "string" },
          answer: { type: "string" },
          source_excerpt: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Ranking: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          company_name: { type: "string" },
          avg_abuse_score: { type: "number" },
          total_analyses: { type: "integer" },
          last_analysis_at: { type: "string", format: "date-time", nullable: true },
        },
      },
    },
  },
  paths: {
    // ─── Health ──────────────────────────────────────────────
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is running",
            content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } } },
          },
        },
      },
    },

    // ─── Auth ────────────────────────────────────────────────
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Criar conta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  full_name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conta criada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "object", properties: { id: { type: "string" }, email: { type: "string" } } },
                    session: { type: "object", properties: { access_token: { type: "string" }, refresh_token: { type: "string" }, expires_at: { type: "integer" } } },
                  },
                },
              },
            },
          },
          "400": errorResponse("Erro de validação ou signup"),
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Fazer login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login realizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "object", properties: { id: { type: "string" }, email: { type: "string" } } },
                    session: { type: "object", properties: { access_token: { type: "string" }, refresh_token: { type: "string" }, expires_at: { type: "integer" } } },
                  },
                },
              },
            },
          },
          "401": errorResponse("Credenciais inválidas"),
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Fazer logout",
        security: bearerAuth,
        responses: {
          "200": {
            description: "Logout realizado",
            content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } },
          },
        },
      },
    },

    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obter perfil do usuário",
        security: bearerAuth,
        responses: {
          "200": {
            description: "Perfil do usuário",
            content: { "application/json": { schema: { type: "object", properties: { profile: { $ref: "#/components/schemas/Profile" } } } } },
          },
          "404": errorResponse("Perfil não encontrado"),
        },
      },
    },

    "/api/auth/profile": {
      patch: {
        tags: ["Auth"],
        summary: "Atualizar perfil",
        security: bearerAuth,
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  age_range: enumArray(AGE_RANGES),
                  education_level: enumArray(EDUCATION_LEVELS),
                  preferred_output: enumArray(PREFERRED_OUTPUTS),
                  font_size: { type: "integer", minimum: 12, maximum: 32 },
                  high_contrast: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado",
            content: { "application/json": { schema: { type: "object", properties: { profile: { $ref: "#/components/schemas/Profile" } } } } },
          },
          "500": errorResponse("Erro ao atualizar"),
        },
      },
    },

    // ─── Documents ───────────────────────────────────────────
    "/api/documents/text": {
      post: {
        tags: ["Documents"],
        summary: "Criar documento de texto",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "raw_text"],
                properties: {
                  title: { type: "string", minLength: 1, maxLength: 200 },
                  raw_text: { type: "string", minLength: 10, maxLength: 100000 },
                  doc_type: { ...enumArray(DOC_TYPES), default: "outro" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Documento criado",
            content: { "application/json": { schema: { type: "object", properties: { document: { $ref: "#/components/schemas/Document" } } } } },
          },
          "500": errorResponse("Erro ao salvar"),
        },
      },
    },

    "/api/documents/upload": {
      post: {
        tags: ["Documents"],
        summary: "Upload de PDF ou imagem",
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary", description: "PDF, JPEG ou PNG (máx 5 MB)" },
                  title: { type: "string", description: "Título (padrão: nome do arquivo)" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Upload realizado",
            content: { "application/json": { schema: { type: "object", properties: { document: { $ref: "#/components/schemas/Document" } } } } },
          },
          "400": errorResponse("Arquivo ausente, tipo não suportado ou > 5 MB"),
        },
      },
    },

    "/api/documents": {
      get: {
        tags: ["Documents"],
        summary: "Listar documentos do usuário",
        security: bearerAuth,
        responses: {
          "200": {
            description: "Lista de documentos",
            content: {
              "application/json": {
                schema: { type: "object", properties: { documents: { type: "array", items: { $ref: "#/components/schemas/Document" } } } },
              },
            },
          },
        },
      },
    },

    "/api/documents/{id}": {
      get: {
        tags: ["Documents"],
        summary: "Obter documento",
        security: bearerAuth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Documento encontrado",
            content: { "application/json": { schema: { type: "object", properties: { document: { $ref: "#/components/schemas/Document" } } } } },
          },
          "404": errorResponse("Documento não encontrado"),
        },
      },
      delete: {
        tags: ["Documents"],
        summary: "Excluir documento (soft delete)",
        security: bearerAuth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Documento excluído",
            content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } },
          },
        },
      },
    },

    "/api/documents/{documentId}/generate": {
      post: {
        tags: ["Documents"],
        summary: "Gerar documento legal (Procon, Juizado, SAC)",
        security: bearerAuth,
        parameters: [{ name: "documentId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["type", "empresa", "problema"],
                properties: {
                  type: { type: "string", enum: ["procon", "juizado", "sac"] },
                  empresa: { type: "string", minLength: 1 },
                  problema: { type: "string", minLength: 10 },
                  nome: { type: "string" },
                  cpf: { type: "string" },
                  data_ocorrencia: { type: "string" },
                  valor: { type: "string" },
                  tentativas_anteriores: { type: "string" },
                  pedido: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Documento gerado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    generated: {
                      type: "object",
                      properties: {
                        documento: { type: "string" },
                        tipo: { type: "string" },
                        instrucoes: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": errorResponse("Erro de validação"),
        },
      },
    },

    // ─── Analyze ─────────────────────────────────────────────
    "/api/analyze/{documentId}": {
      post: {
        tags: ["Analyze"],
        summary: "Analisar documento com IA",
        description: "Executa o pipeline de análise. Limite: 10/mês (free) ou 100/mês (premium).",
        security: bearerAuth,
        parameters: [{ name: "documentId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  analysis_type: { ...enumArray(ANALYSIS_TYPES), default: "tos" },
                  simplification_level: { ...enumArray(SIMPLIFICATION_LEVELS), default: "medio" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Análise criada",
            content: { "application/json": { schema: { type: "object", properties: { analysis: { $ref: "#/components/schemas/Analysis" } } } } },
          },
          "404": errorResponse("Documento não encontrado"),
          "400": errorResponse("Documento sem texto"),
          "429": errorResponse("Limite de análises atingido"),
        },
      },
    },

    "/api/analyze/{analysisId}": {
      get: {
        tags: ["Analyze"],
        summary: "Obter resultado da análise",
        security: bearerAuth,
        parameters: [{ name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Análise encontrada",
            content: { "application/json": { schema: { type: "object", properties: { analysis: { $ref: "#/components/schemas/Analysis" } } } } },
          },
          "404": errorResponse("Análise não encontrada"),
        },
      },
    },

    "/api/analyze/{analysisId}/audio": {
      post: {
        tags: ["Analyze"],
        summary: "Gerar áudio da análise",
        description: "Gera narração em áudio do resumo da análise via ElevenLabs. Retorna cache se já existir.",
        security: bearerAuth,
        parameters: [{ name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "201": {
            description: "Áudio gerado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { audio: { type: "object", properties: { audioUrl: { type: "string" }, cached: { type: "boolean" } } } },
                },
              },
            },
          },
          "404": errorResponse("Análise não encontrada"),
          "400": errorResponse("Sem conteúdo para gerar áudio"),
        },
      },
    },

    "/api/analyze/{analysisId}/ask": {
      post: {
        tags: ["Analyze"],
        summary: "Perguntar sobre a análise",
        security: bearerAuth,
        parameters: [{ name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["question"],
                properties: {
                  question: { type: "string", minLength: 3, maxLength: 500 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Resposta gerada",
            content: { "application/json": { schema: { type: "object", properties: { question: { $ref: "#/components/schemas/Question" } } } } },
          },
          "404": errorResponse("Análise não encontrada"),
          "502": errorResponse("Não foi possível gerar resposta"),
        },
      },
    },

    "/api/analyze/{analysisId}/questions": {
      get: {
        tags: ["Analyze"],
        summary: "Listar perguntas e respostas",
        security: bearerAuth,
        parameters: [{ name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Lista de Q&A",
            content: {
              "application/json": {
                schema: { type: "object", properties: { questions: { type: "array", items: { $ref: "#/components/schemas/Question" } } } },
              },
            },
          },
        },
      },
    },

    // ─── Ranking ─────────────────────────────────────────────
    "/api/ranking": {
      get: {
        tags: ["Ranking"],
        summary: "Ranking de empresas por abusividade",
        responses: {
          "200": {
            description: "Lista de rankings",
            content: {
              "application/json": {
                schema: { type: "object", properties: { rankings: { type: "array", items: { $ref: "#/components/schemas/Ranking" } } } },
              },
            },
          },
        },
      },
    },

    "/api/ranking/{company}": {
      get: {
        tags: ["Ranking"],
        summary: "Ranking de uma empresa específica",
        parameters: [{ name: "company", in: "path", required: true, schema: { type: "string" }, description: "Nome da empresa (URL-encoded)" }],
        responses: {
          "200": {
            description: "Ranking da empresa",
            content: { "application/json": { schema: { type: "object", properties: { company: { $ref: "#/components/schemas/Ranking" } } } } },
          },
          "404": errorResponse("Empresa não encontrada"),
        },
      },
    },

    // ─── Share ───────────────────────────────────────────────
    "/api/share/{analysisId}/hash": {
      get: {
        tags: ["Share"],
        summary: "Gerar link de compartilhamento",
        security: bearerAuth,
        parameters: [{ name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": {
            description: "Hash gerado",
            content: {
              "application/json": {
                schema: { type: "object", properties: { hash: { type: "string" }, shareUrl: { type: "string" } } },
              },
            },
          },
        },
      },
    },

    "/api/share/{analysisId}/card": {
      get: {
        tags: ["Share"],
        summary: "Obter card de compartilhamento (público)",
        parameters: [
          { name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "hash", in: "query", required: true, schema: { type: "string" }, description: "HMAC-SHA256 hash" },
        ],
        responses: {
          "200": {
            description: "Share card",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    card: {
                      type: "object",
                      properties: {
                        analysisId: { type: "string" },
                        documentTitle: { type: "string" },
                        documentType: { type: "string" },
                        analysisType: { type: "string" },
                        abuseScore: { type: "number", nullable: true },
                        resumo: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": errorResponse("Hash ausente"),
          "403": errorResponse("Hash inválido"),
          "404": errorResponse("Análise não encontrada"),
        },
      },
    },

    "/api/share/{analysisId}/og": {
      get: {
        tags: ["Share"],
        summary: "Open Graph metadata para link previews",
        parameters: [
          { name: "analysisId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "hash", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "OG metadata",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    og: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" },
                        url: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Demo ────────────────────────────────────────────────
    "/api/demo": {
      get: {
        tags: ["Demo"],
        summary: "Listar demos disponíveis",
        responses: {
          "200": {
            description: "Lista de demos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    demos: {
                      type: "array",
                      items: { type: "object", properties: { key: { type: "string" }, title: { type: "string" } } },
                    },
                  },
                },
              },
            },
          },
          "503": errorResponse("KV cache não configurado"),
        },
      },
    },

    "/api/demo/{category}/{slug}": {
      get: {
        tags: ["Demo"],
        summary: "Obter demo específico",
        parameters: [
          { name: "category", in: "path", required: true, schema: { type: "string" }, description: "Ex: tos, scam, general" },
          { name: "slug", in: "path", required: true, schema: { type: "string" }, description: "Ex: instagram-meta-platforms" },
        ],
        responses: {
          "200": {
            description: "Demo encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    demo: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        doc_type: { type: "string" },
                        sample_text: { type: "string" },
                        analysis: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": errorResponse("Demo não encontrado"),
          "503": errorResponse("KV cache não configurado"),
        },
      },
    },
  },
  tags: [
    { name: "Health", description: "Status da API" },
    { name: "Auth", description: "Autenticação e perfil de usuário" },
    { name: "Documents", description: "Upload e gerenciamento de documentos" },
    { name: "Analyze", description: "Análise de documentos com IA, áudio e Q&A" },
    { name: "Ranking", description: "Ranking público de empresas por abusividade" },
    { name: "Share", description: "Compartilhamento de análises via link" },
    { name: "Demo", description: "Dados de demonstração pré-carregados" },
  ],
};
