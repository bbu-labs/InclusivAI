-- Enums for Clausula Oculta

CREATE TYPE age_range AS ENUM ('18-24', '25-34', '35-44', '45-54', '55-64', '65+');

CREATE TYPE education_level AS ENUM ('fundamental', 'medio', 'superior', 'pos_graduacao');

CREATE TYPE user_plan AS ENUM ('free', 'premium');

CREATE TYPE doc_type AS ENUM (
  'termos_de_uso',
  'contrato',
  'notificacao_judicial',
  'carta_inss',
  'mensagem_suspeita',
  'outro'
);

CREATE TYPE source_type AS ENUM ('text_input', 'pdf_upload', 'image_upload', 'url_import');

CREATE TYPE simplification_level AS ENUM ('fundamental', 'medio', 'tecnico');
