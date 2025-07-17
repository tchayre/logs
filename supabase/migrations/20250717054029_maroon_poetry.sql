/*
  # Sistema de Chamados TI - Schema Inicial

  1. Novas Tabelas
    - `technicians` - Técnicos responsáveis pelos chamados
    - `sectors` - Setores da empresa
    - `categories` - Categorias de problemas
    - `users` - Usuários do sistema
    - `tickets` - Chamados de TI

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para permitir acesso público (sistema interno)

  3. Dados Iniciais
    - Inserir dados padrão para técnicos, setores, categorias e usuários
*/

-- Criar tabela de técnicos
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  email text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de setores
CREATE TABLE IF NOT EXISTS sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  email text,
  sector text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de chamados
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  solution text DEFAULT '',
  technician text NOT NULL,
  sector text NOT NULL,
  user_name text NOT NULL,
  status text NOT NULL DEFAULT 'Aberto',
  category text NOT NULL,
  priority text NOT NULL,
  date_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso público (sistema interno da empresa)
CREATE POLICY "Permitir acesso completo aos técnicos"
  ON technicians
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos setores"
  ON sectors
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às categorias"
  ON categories
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos usuários"
  ON users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos chamados"
  ON tickets
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Inserir dados iniciais - Técnicos
INSERT INTO technicians (name, email) VALUES
  ('João Silva', 'joao.silva@empresa.com'),
  ('Maria Santos', 'maria.santos@empresa.com'),
  ('Pedro Oliveira', 'pedro.oliveira@empresa.com'),
  ('Ana Costa', 'ana.costa@empresa.com'),
  ('Carlos Ferreira', 'carlos.ferreira@empresa.com')
ON CONFLICT (name) DO NOTHING;

-- Inserir dados iniciais - Setores
INSERT INTO sectors (name) VALUES
  ('Administrativo'),
  ('Financeiro'),
  ('Recursos Humanos'),
  ('Vendas'),
  ('Produção'),
  ('TI'),
  ('Marketing')
ON CONFLICT (name) DO NOTHING;

-- Inserir dados iniciais - Categorias
INSERT INTO categories (name) VALUES
  ('Hardware'),
  ('Software'),
  ('Rede'),
  ('Email'),
  ('Impressora'),
  ('Sistema'),
  ('Telefonia'),
  ('Outros')
ON CONFLICT (name) DO NOTHING;

-- Inserir dados iniciais - Usuários
INSERT INTO users (name, email, sector) VALUES
  ('Roberto Silva', 'roberto.silva@empresa.com', 'Administrativo'),
  ('Fernanda Lima', 'fernanda.lima@empresa.com', 'Financeiro'),
  ('Marcos Pereira', 'marcos.pereira@empresa.com', 'Vendas'),
  ('Juliana Rocha', 'juliana.rocha@empresa.com', 'Recursos Humanos'),
  ('André Souza', 'andre.souza@empresa.com', 'Produção')
ON CONFLICT (name) DO NOTHING;