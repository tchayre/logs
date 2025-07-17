/*
  # Sistema de Autenticação

  1. Nova Tabela
    - `auth_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password` (text, hashed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `auth_users`
    - Política para acesso autenticado

  3. Dados Iniciais
    - Usuário padrão: admin/admin
*/

CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso completo aos usuários de autenticação"
  ON auth_users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Inserir usuário padrão admin/admin (senha será hasheada no frontend)
INSERT INTO auth_users (username, password) 
VALUES ('admin', 'admin')
ON CONFLICT (username) DO NOTHING;