import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não encontradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos TypeScript para as tabelas
export interface Technician {
  id: string;
  name: string;
  email?: string;
  active: boolean;
  created_at: string;
}

export interface Sector {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  sector?: string;
  active: boolean;
  created_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  solution: string;
  technician: string;
  sector: string;
  user_name: string;
  status: string;
  category: string;
  priority: string;
  date_time: string;
  created_at: string;
  resolved_at?: string;
  updated_at: string;
}