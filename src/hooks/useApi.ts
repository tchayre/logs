import { useState, useEffect, useCallback } from 'react';
import { apiService, Ticket, Technician, Sector, Category, User } from '../services/api';

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

// Hook para gerenciar estado de API
export const useApiState = <T>(initialData: T | null = null): UseApiState<T> & {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { data, loading, error, setData, setLoading, setError };
};

// Hook para lista de dados
export const useApiListState = <T>(initialData: T[] = []): UseApiListState<T> & {
  setData: (data: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { data, loading, error, setData, setLoading, setError };
};

// Hook para chamados
export const useTickets = () => {
  const { data, loading, error, setData, setLoading, setError } = useApiListState<Ticket>();

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tickets = await apiService.getTickets();
      setData(tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar chamados');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  const createTicket = useCallback(async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'dateTime' | 'status' | 'solution' | 'resolvedAt' | 'updatedAt'>) => {
    try {
      const newTicket = await apiService.createTicket(ticket);
      setData(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar chamado');
      throw err;
    }
  }, [setData, setError]);

  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>) => {
    try {
      const updatedTicket = await apiService.updateTicket(id, updates);
      setData(prev => prev.map(ticket => ticket.id === id ? updatedTicket : ticket));
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar chamado');
      throw err;
    }
  }, [setData, setError]);

  const deleteTicket = useCallback(async (id: string) => {
    try {
      await apiService.deleteTicket(id);
      setData(prev => prev.filter(ticket => ticket.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir chamado');
      throw err;
    }
  }, [setData, setError]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return {
    tickets: data,
    loading,
    error,
    loadTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};

// Hook para técnicos
export const useTechnicians = () => {
  const { data, loading, error, setData, setLoading, setError } = useApiListState<Technician>();

  const loadTechnicians = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const technicians = await apiService.getTechnicians();
      setData(technicians);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar técnicos');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  const createTechnician = useCallback(async (technician: { name: string; email?: string }) => {
    try {
      const newTechnician = await apiService.createTechnician(technician);
      setData(prev => [...prev, newTechnician]);
      return newTechnician;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar técnico');
      throw err;
    }
  }, [setData, setError]);

  const updateTechnician = useCallback(async (id: number, updates: Partial<Technician>) => {
    try {
      const updatedTechnician = await apiService.updateTechnician(id, updates);
      setData(prev => prev.map(tech => tech.id === id ? updatedTechnician : tech));
      return updatedTechnician;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar técnico');
      throw err;
    }
  }, [setData, setError]);

  const deleteTechnician = useCallback(async (id: number) => {
    try {
      await apiService.deleteTechnician(id);
      setData(prev => prev.filter(tech => tech.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir técnico');
      throw err;
    }
  }, [setData, setError]);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  return {
    technicians: data,
    loading,
    error,
    loadTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
  };
};

// Hook para setores
export const useSectors = () => {
  const { data, loading, error, setData, setLoading, setError } = useApiListState<Sector>();

  const loadSectors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sectors = await apiService.getSectors();
      setData(sectors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  const createSector = useCallback(async (sector: { name: string }) => {
    try {
      const newSector = await apiService.createSector(sector);
      setData(prev => [...prev, newSector]);
      return newSector;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar setor');
      throw err;
    }
  }, [setData, setError]);

  const updateSector = useCallback(async (id: number, updates: Partial<Sector>) => {
    try {
      const updatedSector = await apiService.updateSector(id, updates);
      setData(prev => prev.map(sector => sector.id === id ? updatedSector : sector));
      return updatedSector;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar setor');
      throw err;
    }
  }, [setData, setError]);

  const deleteSector = useCallback(async (id: number) => {
    try {
      await apiService.deleteSector(id);
      setData(prev => prev.filter(sector => sector.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir setor');
      throw err;
    }
  }, [setData, setError]);

  useEffect(() => {
    loadSectors();
  }, [loadSectors]);

  return {
    sectors: data,
    loading,
    error,
    loadSectors,
    createSector,
    updateSector,
    deleteSector,
  };
};

// Hook para categorias
export const useCategories = () => {
  const { data, loading, error, setData, setLoading, setError } = useApiListState<Category>();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await apiService.getCategories();
      setData(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  const createCategory = useCallback(async (category: { name: string }) => {
    try {
      const newCategory = await apiService.createCategory(category);
      setData(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
      throw err;
    }
  }, [setData, setError]);

  const updateCategory = useCallback(async (id: number, updates: Partial<Category>) => {
    try {
      const updatedCategory = await apiService.updateCategory(id, updates);
      setData(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      throw err;
    }
  }, [setData, setError]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await apiService.deleteCategory(id);
      setData(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir categoria');
      throw err;
    }
  }, [setData, setError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories: data,
    loading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

// Hook para usuários
export const useUsers = () => {
  const { data, loading, error, setData, setLoading, setError } = useApiListState<User>();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await apiService.getUsers();
      setData(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  const createUser = useCallback(async (user: { name: string; email?: string; sector?: string }) => {
    try {
      const newUser = await apiService.createUser(user);
      setData(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
      throw err;
    }
  }, [setData, setError]);

  const updateUser = useCallback(async (id: number, updates: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateUser(id, updates);
      setData(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      throw err;
    }
  }, [setData, setError]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      await apiService.deleteUser(id);
      setData(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
      throw err;
    }
  }, [setData, setError]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users: data,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};