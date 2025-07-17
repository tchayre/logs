# Sistema de Chamados TI com Supabase

Sistema completo de gerenciamento de chamados de TI usando Supabase como backend na nuvem.

## 🚀 Funcionalidades

- ✅ **Backend na Nuvem** com Supabase
- ✅ **Banco PostgreSQL** para persistência
- ✅ **Sincronização em Tempo Real** entre dispositivos
- ✅ **CRUD Completo** para chamados, técnicos, setores, categorias e usuários
- ✅ **Atualizações Instantâneas** com WebSockets
- ✅ **Segurança RLS** (Row Level Security)
- ✅ **Acesso Multi-dispositivo** funcionando perfeitamente

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Variáveis de ambiente configuradas

## ⚙️ Configuração

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá para **Settings > API** e copie:
   - `Project URL`
   - `anon public key`

### 2. Configurar Variáveis de Ambiente

As variáveis já estão configuradas automaticamente quando você conecta o Supabase no Bolt:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Executar Migrações

As tabelas do banco são criadas automaticamente através do arquivo de migração em `supabase/migrations/`.

## 🏃‍♂️ Como Executar

```bash
npm run dev
```

O sistema estará disponível em: http://localhost:5173

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:

- **technicians** - Técnicos responsáveis
- **sectors** - Setores da empresa  
- **categories** - Categorias de problemas
- **users** - Usuários do sistema
- **tickets** - Chamados de TI

### Recursos de Segurança:

- **RLS habilitado** em todas as tabelas
- **Políticas de acesso** configuradas
- **Validação de dados** no frontend e backend

## 🌟 Principais Recursos

### 1. **Sincronização em Tempo Real**
- Mudanças aparecem instantaneamente em todos os dispositivos
- WebSockets para atualizações automáticas
- Sem necessidade de recarregar a página

### 2. **Gerenciamento Completo**
- Criar, editar e excluir chamados
- Gerenciar técnicos, setores, categorias e usuários
- Interface intuitiva e responsiva

### 3. **Relatórios e Exportação**
- Gráficos interativos com Chart.js
- Exportação para Excel
- Estatísticas em tempo real

### 4. **Multi-dispositivo**
- Acesse de qualquer lugar
- Dados sempre sincronizados
- Interface responsiva

## 🔧 Tecnologias Utilizadas

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Chart.js
- Lucide React

**Backend:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions
- RESTful API automática

## 📱 Como Testar Multi-dispositivo

1. Abra o sistema em um dispositivo
2. Crie ou edite um chamado
3. Abra o sistema em outro dispositivo
4. Veja as mudanças aparecerem automaticamente!

## 🚀 Deploy

O sistema pode ser facilmente deployado em:
- Netlify (frontend)
- Vercel (frontend)
- Supabase (backend já está na nuvem)

## 🔒 Segurança

- Todas as tabelas têm RLS habilitado
- Políticas de acesso configuradas
- Validação de dados em múltiplas camadas
- Conexão segura com HTTPS

## 📈 Próximos Passos

Para produção, considere:
- Implementar autenticação de usuários
- Adicionar logs de auditoria
- Configurar backup automático
- Implementar notificações push
- Adicionar testes automatizados

---

**Sistema pronto para uso profissional com sincronização em tempo real!** 🎉