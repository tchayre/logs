import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Key, Edit3, Save, X } from 'lucide-react';
import { authService, AuthUser } from '../services/authService';

interface UserManagementProps {
  onClose: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para formulários
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  // Estados para novo usuário
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Estados para alterar senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para alterar username
  const [newUsernameChange, setNewUsernameChange] = useState('');

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersList = await authService.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres');
      return;
    }

    try {
      await authService.createUser(newUsername, newPassword);
      setSuccess('Usuário criado com sucesso!');
      setNewUsername('');
      setNewPassword('');
      setShowNewUserForm(false);
      loadUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar usuário');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      setSuccess('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao excluir usuário');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPasswordChange !== confirmPassword) {
      setError('Nova senha e confirmação não coincidem');
      return;
    }

    if (newPasswordChange.length < 4) {
      setError('Nova senha deve ter pelo menos 4 caracteres');
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPasswordChange);
      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPasswordChange('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao alterar senha');
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newUsernameChange.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    try {
      await authService.changeUsername(newUsernameChange);
      setSuccess('Nome de usuário alterado com sucesso!');
      setNewUsernameChange('');
      setShowChangeUsername(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao alterar nome de usuário');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Gerenciar Usuários
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              {error}
              <button onClick={clearMessages} className="text-red-700 hover:text-red-900">×</button>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              {success}
              <button onClick={clearMessages} className="text-green-700 hover:text-green-900">×</button>
            </div>
          )}

          {/* Ações do usuário atual */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Minha Conta ({currentUser?.username})</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowChangeUsername(true);
                  setNewUsernameChange(currentUser?.username || '');
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Alterar Usuário
              </button>
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Key className="w-4 h-4" />
                Alterar Senha
              </button>
            </div>
          </div>

          {/* Formulário para alterar username */}
          {showChangeUsername && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Alterar Nome de Usuário</h4>
              <form onSubmit={handleChangeUsername} className="space-y-3">
                <input
                  type="text"
                  placeholder="Novo nome de usuário"
                  value={newUsernameChange}
                  onChange={(e) => setNewUsernameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangeUsername(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Formulário para alterar senha */}
          {showChangePassword && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Alterar Senha</h4>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={newPasswordChange}
                  onChange={(e) => setNewPasswordChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Alterar Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de usuários */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Todos os Usuários</h3>
            <button
              onClick={() => setShowNewUserForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Usuário
            </button>
          </div>

          {/* Formulário para novo usuário */}
          {showNewUserForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Criar Novo Usuário</h4>
              <form onSubmit={handleCreateUser} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome de usuário"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Criar Usuário
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewUserForm(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de usuários */}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Carregando usuários...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{user.username}</span>
                    {user.id === currentUser?.id && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Você
                      </span>
                    )}
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};