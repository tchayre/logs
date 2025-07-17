const API_BASE_URL = 'http://localhost:3001/api';

interface Ticket {
  id: string;
  title: string;
  description: string;
  solution: string;
  technician: string;
  sector: string;
  user: string;
  status: string;
  category: string;
  priority: string;
  dateTime: string;
  createdAt: string;
  resolvedAt?: string;
  updatedAt?: string;
}

interface Technician {
  id: number;
  name: string;
  email?: string;
  active: number;
  createdAt: string;
}

interface Sector {
  id: number;
  name: string;
  active: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  active: number;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
  sector?: string;
  active: number;
  createdAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Tickets API
  async getTickets(): Promise<Ticket[]> {
    return this.request<Ticket[]>('/tickets');
  }

  async getTicket(id: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}`);
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'dateTime' | 'status' | 'solution' | 'resolvedAt' | 'updatedAt'>): Promise<Ticket> {
    return this.request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket),
    });
  }

  async deleteTicket(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  // Technicians API
  async getTechnicians(): Promise<Technician[]> {
    return this.request<Technician[]>('/technicians');
  }

  async createTechnician(technician: { name: string; email?: string }): Promise<Technician> {
    return this.request<Technician>('/technicians', {
      method: 'POST',
      body: JSON.stringify(technician),
    });
  }

  async updateTechnician(id: number, technician: Partial<Technician>): Promise<Technician> {
    return this.request<Technician>(`/technicians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(technician),
    });
  }

  async deleteTechnician(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/technicians/${id}`, {
      method: 'DELETE',
    });
  }

  // Sectors API
  async getSectors(): Promise<Sector[]> {
    return this.request<Sector[]>('/sectors');
  }

  async createSector(sector: { name: string }): Promise<Sector> {
    return this.request<Sector>('/sectors', {
      method: 'POST',
      body: JSON.stringify(sector),
    });
  }

  async updateSector(id: number, sector: Partial<Sector>): Promise<Sector> {
    return this.request<Sector>(`/sectors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sector),
    });
  }

  async deleteSector(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sectors/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(category: { name: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async createUser(user: { name: string; email?: string; sector?: string }): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
export type { Ticket, Technician, Sector, Category, User };