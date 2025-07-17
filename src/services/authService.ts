import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  // Função simples de hash (em produção, use bcrypt ou similar)
  private hashPassword(password: string): string {
    // Hash simples para demonstração - em produção use bcrypt
    return btoa(password + 'salt123');
  }

  // Verificar se há usuário logado no localStorage
  getCurrentUser(): AuthUser | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  // Login
  async login(username: string, password: string): Promise<AuthUser> {
    try {
      // Primeiro, verificar se é o usuário padrão admin/admin
      if (username === 'admin' && password === 'admin') {
        // Verificar se já existe no banco
        const { data: existingUser } = await supabase
          .from('auth_users')
          .select('*')
          .eq('username', 'admin')
          .single();

        if (!existingUser) {
          // Criar usuário admin se não existir
          const { data: newUser, error } = await supabase
            .from('auth_users')
            .insert([{ username: 'admin', password: this.hashPassword('admin') }])
            .select()
            .single();

          if (error) throw new Error(`Erro ao criar usuário admin: ${error.message}`);
          
          this.currentUser = newUser;
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          return newUser;
        } else {
          this.currentUser = existingUser;
          localStorage.setItem('currentUser', JSON.stringify(existingUser));
          return existingUser;
        }
      }

      // Para outros usuários, verificar no banco
      const hashedPassword = this.hashPassword(password);
      
      const { data: user, error } = await supabase
        .from('auth_users')
        .select('*')
        .eq('username', username)
        .eq('password', hashedPassword)
        .single();

      if (error || !user) {
        throw new Error('Usuário ou senha inválidos');
      }

      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro no login');
    }
  }

  // Logout
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Verificar se está logado
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Alterar senha do usuário atual
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    // Verificar senha atual
    const hashedCurrentPassword = this.hashPassword(currentPassword);
    if (user.password !== hashedCurrentPassword) {
      throw new Error('Senha atual incorreta');
    }

    // Atualizar senha
    const hashedNewPassword = this.hashPassword(newPassword);
    const { error } = await supabase
      .from('auth_users')
      .update({ 
        password: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw new Error(`Erro ao alterar senha: ${error.message}`);

    // Atualizar usuário local
    user.password = hashedNewPassword;
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Alterar username do usuário atual
  async changeUsername(newUsername: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Usuário não logado');

    const { error } = await supabase
      .from('auth_users')
      .update({ 
        username: newUsername,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      if (error.code === '23505') {
        throw new Error('Nome de usuário já existe');
      }
      throw new Error(`Erro ao alterar usuário: ${error.message}`);
    }

    // Atualizar usuário local
    user.username = newUsername;
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Criar novo usuário (apenas para admin)
  async createUser(username: string, password: string): Promise<AuthUser> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Usuário não logado');

    const hashedPassword = this.hashPassword(password);
    
    const { data: newUser, error } = await supabase
      .from('auth_users')
      .insert([{ username, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Nome de usuário já existe');
      }
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }

    return newUser;
  }

  // Listar todos os usuários
  async getAllUsers(): Promise<AuthUser[]> {
    const { data: users, error } = await supabase
      .from('auth_users')
      .select('*')
      .order('username');

    if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`);
    return users || [];
  }

  // Deletar usuário
  async deleteUser(userId: string): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Usuário não logado');
    if (currentUser.id === userId) throw new Error('Não é possível deletar o próprio usuário');

    const { error } = await supabase
      .from('auth_users')
      .delete()
      .eq('id', userId);

    if (error) throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
}

export const authService = new AuthService();