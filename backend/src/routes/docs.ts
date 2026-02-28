import { Hono } from "hono";
import { openApiSpec } from "../openapi-spec";

const docs = new Hono();

// GET /openapi.json — raw OpenAPI spec
docs.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

// GET / — Scalar API reference UI
docs.get("/", (c) => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>InclusivAI — API Docs</title>
  <style>body { margin: 0; }</style>
</head>
<body>
  <script id="api-reference" data-url="./docs/openapi.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return c.html(html);
});

export default docs;
