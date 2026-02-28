# Cláusula Oculta - InclusivAI

Sistema multi-agente de IA que transforma documentos oficiais, jurídicos ou contratuais em linguagem acessível.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **daisyUI v5**
- **React Icons**

## Fluxo do Usuário

1. **Tela Inicial** - Escolha o método de entrada (URL, Câmera/Foto, Arquivo)
2. **Entrada** - Insira URL, capture foto ou envie arquivo
3. **Processamento** - Extração de texto, OCR, limpeza e identificação
4. **Confirmação** - Validação do tipo de documento
5. **Resultado** - Score de risco, cláusulas identificadas, recomendações
6. **Detalhe** - Visão detalhada de cada cláusula

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).
