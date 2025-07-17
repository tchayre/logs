import { useState, useEffect, useCallback } from 'react';
import { supabaseApi } from '../services/supabaseApi';
import { Technician, Sector, Category, User, Ticket } from '../services/supabase';

// Hook genérico para estado da API
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Hook para técnicos
export const useTechnicians = () => {
  const [state, setState] = useState<UseApiListState<Technician>>({
    data: [],
    loading: true,
    error: null
  });

  const loadTechnicians = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const technicians = await supabaseApi.getTechnicians();
      setState({ data: technicians, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }));
    }
  }, []);

  const createTechnician = useCallback(async (technician: { name: string; email?: string }) => {
    try {
      const newTechnician = await supabaseApi.createTechnician(technician);
      setState(prev => ({ 
        ...prev, 
        data: [...prev.data, newTechnician],
        error: null 
      }));
      return newTechnician;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar técnico';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateTechnician = useCallback(async (id: string, updates: Partial<Technician>) => {
    try {
      const updatedTechnician = await supabaseApi.updateTechnician(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(tech => tech.id === id ? updatedTechnician : tech),
        error: null
      }));
      return updatedTechnician;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar técnico';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteTechnician = useCallback(async (id: string) => {
    try {
      await supabaseApi.deleteTechnician(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(tech => tech.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir técnico';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  useEffect(() => {
    loadTechnicians();

    // Subscrever a mudanças em tempo real
    const subscription = supabaseApi.subscribeToTechnicians((technicians) => {
      setState(prev => ({ ...prev, data: technicians }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadTechnicians]);

  return {
    technicians: state.data,
    loading: state.loading,
    error: state.error,
    loadTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician
  };
};

// Hook para setores
export const useSectors = () => {
  const [state, setState] = useState<UseApiListState<Sector>>({
    data: [],
    loading: true,
    error: null
  });

  const loadSectors = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const sectors = await supabaseApi.getSectors();
      setState({ data: sectors, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }));
    }
  }, []);

  const createSector = useCallback(async (sector: { name: string }) => {
    try {
      const newSector = await supabaseApi.createSector(sector);
      setState(prev => ({ 
        ...prev, 
        data: [...prev.data, newSector],
        error: null 
      }));
      return newSector;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar setor';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateSector = useCallback(async (id: string, updates: Partial<Sector>) => {
    try {
      const updatedSector = await supabaseApi.updateSector(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(sector => sector.id === id ? updatedSector : sector),
        error: null
      }));
      return updatedSector;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar setor';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteSector = useCallback(async (id: string) => {
    try {
      await supabaseApi.deleteSector(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(sector => sector.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir setor';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  useEffect(() => {
    loadSectors();

    const subscription = supabaseApi.subscribeToSectors((sectors) => {
      setState(prev => ({ ...prev, data: sectors }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSectors]);

  return {
    sectors: state.data,
    loading: state.loading,
    error: state.error,
    loadSectors,
    createSector,
    updateSector,
    deleteSector
  };
};

// Hook para categorias
export const useCategories = () => {
  const [state, setState] = useState<UseApiListState<Category>>({
    data: [],
    loading: true,
    error: null
  });

  const loadCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const categories = await supabaseApi.getCategories();
      setState({ data: categories, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }));
    }
  }, []);

  const createCategory = useCallback(async (category: { name: string }) => {
    try {
      const newCategory = await supabaseApi.createCategory(category);
      setState(prev => ({ 
        ...prev, 
        data: [...prev.data, newCategory],
        error: null 
      }));
      return newCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar categoria';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    try {
      const updatedCategory = await supabaseApi.updateCategory(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(cat => cat.id === id ? updatedCategory : cat),
        error: null
      }));
      return updatedCategory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar categoria';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await supabaseApi.deleteCategory(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(cat => cat.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir categoria';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  useEffect(() => {
    loadCategories();

    const subscription = supabaseApi.subscribeToCategories((categories) => {
      setState(prev => ({ ...prev, data: categories }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadCategories]);

  return {
    categories: state.data,
    loading: state.loading,
    error: state.error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

// Hook para usuários
export const useUsers = () => {
  const [state, setState] = useState<UseApiListState<User>>({
    data: [],
    loading: true,
    error: null
  });

  const loadUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const users = await supabaseApi.getUsers();
      setState({ data: users, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }));
    }
  }, []);

  const createUser = useCallback(async (user: { name: string; email?: string; sector?: string }) => {
    try {
      const newUser = await supabaseApi.createUser(user);
      setState(prev => ({ 
        ...prev, 
        data: [...prev.data, newUser],
        error: null 
      }));
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await supabaseApi.updateUser(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(user => user.id === id ? updatedUser : user),
        error: null
      }));
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await supabaseApi.deleteUser(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(user => user.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  useEffect(() => {
    loadUsers();

    const subscription = supabaseApi.subscribeToUsers((users) => {
      setState(prev => ({ ...prev, data: users }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUsers]);

  return {
    users: state.data,
    loading: state.loading,
    error: state.error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  };
};

// Hook para chamados
export const useTickets = () => {
  const [state, setState] = useState<UseApiListState<Ticket>>({
    data: [],
    loading: true,
    error: null
  });

  const loadTickets = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tickets = await supabaseApi.getTickets();
      setState({ data: tickets, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }));
    }
  }, []);

  const createTicket = useCallback(async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTicket = await supabaseApi.createTicket(ticket);
      setState(prev => ({ 
        ...prev, 
        data: [newTicket, ...prev.data],
        error: null 
      }));
      return newTicket;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar chamado';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>) => {
    try {
      const updatedTicket = await supabaseApi.updateTicket(id, updates);
      setState(prev => ({
        ...prev,
        data: prev.data.map(ticket => ticket.id === id ? updatedTicket : ticket),
        error: null
      }));
      return updatedTicket;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar chamado';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteTicket = useCallback(async (id: string) => {
    try {
      await supabaseApi.deleteTicket(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(ticket => ticket.id !== id),
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir chamado';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  useEffect(() => {
    loadTickets();

    // Subscrever a mudanças em tempo real
    const subscription = supabaseApi.subscribeToTickets((tickets) => {
      setState(prev => ({ ...prev, data: tickets }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadTickets]);

  return {
    tickets: state.data,
    loading: state.loading,
    error: state.error,
    loadTickets,
    createTicket,
    updateTicket,
    deleteTicket
  };
};