import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  Settings, 
  Download,
  Users,
  Building2,
  Tag,
  UserCheck,
  LogOut
} from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { UserManagement } from './components/UserManagement';
import { DashboardCharts } from './components/Charts';
import { exportToExcel } from './utils/excelExport';
import { authService } from './services/authService';
import { 
  useTickets, 
  useTechnicians, 
  useSectors, 
  useCategories, 
  useUsers 
} from './hooks/useSupabase';

// Componente de Status de Conexão
const ConnectionStatus: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      Conectado ao Supabase
    </div>
  );
};

// Componente principal
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [managementType, setManagementType] = useState<'technicians' | 'sectors' | 'categories' | 'users'>('technicians');

  // Hooks do Supabase
  const { tickets, loading: ticketsLoading, error: ticketsError, createTicket, updateTicket, deleteTicket } = useTickets();
  const { technicians, loading: techniciansLoading, createTechnician, updateTechnician, deleteTechnician } = useTechnicians();
  const { sectors, loading: sectorsLoading, createSector, updateSector, deleteSector } = useSectors();
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const { users, loading: usersLoading, createUser, updateUser, deleteUser } = useUsers();

  // Estados para formulários
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    technician: '',
    sector: '',
    user_name: '',
    category: '',
    priority: 'Média',
    solution: '',
    status: 'Aberto',
    date_time: new Date().toISOString()
  });

  const [newItem, setNewItem] = useState({ name: '', email: '', sector: '' });

  // Função para login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Função para logout
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Função para criar/editar chamado
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, newTicket);
      } else {
        await createTicket(newTicket);
      }
      
      // Reset form
      setNewTicket({
        title: '',
        description: '',
        technician: '',
        sector: '',
        user_name: '',
        category: '',
        priority: 'Média',
        solution: '',
        status: 'Aberto',
        date_time: new Date().toISOString()
      });
      setShowTicketForm(false);
      setEditingTicket(null);
    } catch (error) {
      console.error('Erro ao salvar chamado:', error);
    }
  };

  // Função para editar chamado
  const handleEditTicket = (ticket: any) => {
    setNewTicket({
      title: ticket.title,
      description: ticket.description,
      technician: ticket.technician,
      sector: ticket.sector,
      user_name: ticket.user_name,
      category: ticket.category,
      priority: ticket.priority,
      solution: ticket.solution || '',
      status: ticket.status,
      date_time: ticket.date_time
    });
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  // Função para gerenciar itens (técnicos, setores, etc.)
  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (managementType) {
        case 'technicians':
          await createTechnician({ name: newItem.name, email: newItem.email });
          break;
        case 'sectors':
          await createSector({ name: newItem.name });
          break;
        case 'categories':
          await createCategory({ name: newItem.name });
          break;
        case 'users':
          await createUser({ name: newItem.name, email: newItem.email, sector: newItem.sector });
          break;
      }
      setNewItem({ name: '', email: '', sector: '' });
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  // Função para exportar para Excel
  const handleExport = () => {
    try {
      const currentDate = new Date();
      exportToExcel(filteredTickets, {
        startMonth: 1,
        startYear: currentDate.getFullYear(),
        endMonth: 12,
        endYear: currentDate.getFullYear()
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  // Estatísticas
  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === 'Aberto').length,
    emAndamento: tickets.filter(t => t.status === 'Em Andamento').length,
    resolvidos: tickets.filter(t => t.status === 'Resolvido').length
  };

  if (ticketsLoading || techniciansLoading || sectorsLoading || categoriesLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do Supabase...</p>
        </div>
      </div>
    );
  }

  if (ticketsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Erro ao conectar com o Supabase:</p>
          <p className="text-gray-600">{ticketsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Chamados TI</h1>
                <p className="text-sm text-gray-500">Gerenciamento Profissional Completo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus />
              <button
                onClick={() => setShowManagement(!showManagement)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Gerenciar
              </button>
              <button
                onClick={() => setShowUserManagement(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                Usuários
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abertos</p>
                <p className="text-2xl font-bold text-red-600">{stats.abertos}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.emAndamento}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvidos}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Chamados
                </div>
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'charts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Relatórios
                </div>
              </button>
            </nav>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {activeTab === 'tickets' && (
              <div>
                {/* Controles */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar chamados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos os Status</option>
                      <option value="Aberto">Aberto</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Resolvido">Resolvido</option>
                    </select>
                    
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Excel
                    </button>
                    
                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Novo Chamado
                    </button>
                  </div>
                </div>

                {/* Lista de Chamados */}
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'Aberto' ? 'bg-red-100 text-red-800' :
                            ticket.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'Baixa' ? 'bg-green-100 text-green-800' :
                            ticket.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.priority === 'Alta' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div><strong>Técnico:</strong> {ticket.technician}</div>
                        <div><strong>Setor:</strong> {ticket.sector}</div>
                        <div><strong>Usuário:</strong> {ticket.user_name}</div>
                        <div><strong>Categoria:</strong> {ticket.category}</div>
                        <div><strong>Data:</strong> {new Date(ticket.date_time).toLocaleString('pt-BR')}</div>
                      </div>

                      {ticket.solution && (
                        <div className="bg-white rounded p-3 mb-3">
                          <strong className="text-sm text-gray-700">Solução:</strong>
                          <p className="text-sm text-gray-600 mt-1">{ticket.solution}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTickets.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum chamado encontrado</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'charts' && (
              <DashboardCharts tickets={tickets} />
            )}
          </div>
        </div>
      </div>

      {/* Modal de Formulário de Chamado */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingTicket ? 'Editar Chamado' : 'Novo Chamado'}
              </h2>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
                    <select
                      required
                      value={newTicket.technician}
                      onChange={(e) => setNewTicket({...newTicket, technician: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um técnico</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.name}>{tech.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                    <select
                      required
                      value={newTicket.sector}
                      onChange={(e) => setNewTicket({...newTicket, sector: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um setor</option>
                      {sectors.map((sector) => (
                        <option key={sector.id} value={sector.name}>{sector.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                    <select
                      required
                      value={newTicket.user_name}
                      onChange={(e) => setNewTicket({...newTicket, user_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um usuário</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      required
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newTicket.status}
                      onChange={(e) => setNewTicket({...newTicket, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Aberto">Aberto</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Resolvido">Resolvido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Solução</label>
                  <textarea
                    rows={3}
                    value={newTicket.solution}
                    onChange={(e) => setNewTicket({...newTicket, solution: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva a solução aplicada (opcional)"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTicketForm(false);
                      setEditingTicket(null);
                      setNewTicket({
                        title: '',
                        description: '',
                        technician: '',
                        sector: '',
                        user_name: '',
                        category: '',
                        priority: 'Média',
                        solution: '',
                        status: 'Aberto',
                        date_time: new Date().toISOString()
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTicket ? 'Atualizar' : 'Criar'} Chamado
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento */}
      {showManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gerenciar Sistema</h2>
                <button
                  onClick={() => setShowManagement(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Abas de Gerenciamento */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { key: 'technicians', label: 'Técnicos', icon: UserCheck },
                    { key: 'sectors', label: 'Setores', icon: Building2 },
                    { key: 'categories', label: 'Categorias', icon: Tag },
                    { key: 'users', label: 'Usuários', icon: Users }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setManagementType(key as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                        managementType === key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Formulário para adicionar novo item */}
              <form onSubmit={handleSubmitItem} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">
                  Adicionar {managementType === 'technicians' ? 'Técnico' : 
                            managementType === 'sectors' ? 'Setor' :
                            managementType === 'categories' ? 'Categoria' : 'Usuário'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {(managementType === 'technicians' || managementType === 'users') && (
                    <input
                      type="email"
                      placeholder="Email"
                      value={newItem.email}
                      onChange={(e) => setNewItem({...newItem, email: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  {managementType === 'users' && (
                    <select
                      value={newItem.sector}
                      onChange={(e) => setNewItem({...newItem, sector: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um setor</option>
                      {sectors.map((sector) => (
                        <option key={sector.id} value={sector.name}>{sector.name}</option>
                      ))}
                    </select>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </form>

              {/* Lista de itens */}
              <div className="space-y-2">
                {managementType === 'technicians' && technicians.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.email && <span className="text-gray-500 ml-2">({item.email})</span>}
                    </div>
                    <button
                      onClick={() => deleteTechnician(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                {managementType === 'sectors' && sectors.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <button
                      onClick={() => deleteSector(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                {managementType === 'categories' && categories.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <button
                      onClick={() => deleteCategory(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}

                {managementType === 'users' && users.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.email && <span className="text-gray-500 ml-2">({item.email})</span>}
                      {item.sector && <span className="text-gray-500 ml-2">- {item.sector}</span>}
                    </div>
                    <button
                      onClick={() => deleteUser(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Usuários */}
      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
};

export default App;