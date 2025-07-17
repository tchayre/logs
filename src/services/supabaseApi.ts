import { supabase, Technician, Sector, Category, User, Ticket } from './supabase';

class SupabaseApiService {
  // Técnicos
  async getTechnicians(): Promise<Technician[]> {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw new Error(`Erro ao buscar técnicos: ${error.message}`);
    return data || [];
  }

  async createTechnician(technician: { name: string; email?: string }): Promise<Technician> {
    const { data, error } = await supabase
      .from('technicians')
      .insert([technician])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar técnico: ${error.message}`);
    return data;
  }

  async updateTechnician(id: string, updates: Partial<Technician>): Promise<Technician> {
    const { data, error } = await supabase
      .from('technicians')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar técnico: ${error.message}`);
    return data;
  }

  async deleteTechnician(id: string): Promise<void> {
    const { error } = await supabase
      .from('technicians')
      .update({ active: false })
      .eq('id', id);

    if (error) throw new Error(`Erro ao desativar técnico: ${error.message}`);
  }

  // Setores
  async getSectors(): Promise<Sector[]> {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw new Error(`Erro ao buscar setores: ${error.message}`);
    return data || [];
  }

  async createSector(sector: { name: string }): Promise<Sector> {
    const { data, error } = await supabase
      .from('sectors')
      .insert([sector])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar setor: ${error.message}`);
    return data;
  }

  async updateSector(id: string, updates: Partial<Sector>): Promise<Sector> {
    const { data, error } = await supabase
      .from('sectors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar setor: ${error.message}`);
    return data;
  }

  async deleteSector(id: string): Promise<void> {
    const { error } = await supabase
      .from('sectors')
      .update({ active: false })
      .eq('id', id);

    if (error) throw new Error(`Erro ao desativar setor: ${error.message}`);
  }

  // Categorias
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw new Error(`Erro ao buscar categorias: ${error.message}`);
    return data || [];
  }

  async createCategory(category: { name: string }): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar categoria: ${error.message}`);
    return data;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar categoria: ${error.message}`);
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({ active: false })
      .eq('id', id);

    if (error) throw new Error(`Erro ao desativar categoria: ${error.message}`);
  }

  // Usuários
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`);
    return data || [];
  }

  async createUser(user: { name: string; email?: string; sector?: string }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar usuário: ${error.message}`);
    return data;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ active: false })
      .eq('id', id);

    if (error) throw new Error(`Erro ao desativar usuário: ${error.message}`);
  }

  // Chamados
  async getTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar chamados: ${error.message}`);
    return data || [];
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        ...ticket,
        date_time: ticket.date_time || new Date().toISOString(),
        resolved_at: ticket.status === 'Resolvido' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar chamado: ${error.message}`);
    return data;
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      resolved_at: updates.status === 'Resolvido' ? new Date().toISOString() : 
                   updates.status === 'Aberto' || updates.status === 'Em Andamento' ? null : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const { data, error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar chamado: ${error.message}`);
    return data;
  }

  async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao excluir chamado: ${error.message}`);
  }

  // Função para escutar mudanças em tempo real
  subscribeToTickets(callback: (tickets: Ticket[]) => void) {
    return supabase
      .channel('tickets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tickets' },
        () => {
          // Recarregar dados quando houver mudanças
          this.getTickets().then(callback);
        }
      )
      .subscribe();
  }

  subscribeToTechnicians(callback: (technicians: Technician[]) => void) {
    return supabase
      .channel('technicians-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'technicians' },
        () => {
          this.getTechnicians().then(callback);
        }
      )
      .subscribe();
  }

  subscribeToSectors(callback: (sectors: Sector[]) => void) {
    return supabase
      .channel('sectors-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sectors' },
        () => {
          this.getSectors().then(callback);
        }
      )
      .subscribe();
  }

  subscribeToCategories(callback: (categories: Category[]) => void) {
    return supabase
      .channel('categories-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          this.getCategories().then(callback);
        }
      )
      .subscribe();
  }

  subscribeToUsers(callback: (users: User[]) => void) {
    return supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => {
          this.getUsers().then(callback);
        }
      )
      .subscribe();
  }
}

export const supabaseApi = new SupabaseApiService();