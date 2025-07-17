import * as XLSX from 'xlsx';

import { Ticket } from '../services/supabase';

interface ExportOptions {
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

export const exportToExcel = (tickets: Ticket[], options: ExportOptions) => {
  // Filtrar tickets pelo período selecionado
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.date_time);
    const ticketMonth = ticketDate.getMonth() + 1;
    const ticketYear = ticketDate.getFullYear();
    
    const startDate = new Date(options.startYear, options.startMonth - 1, 1);
    const endDate = new Date(options.endYear, options.endMonth, 0);
    const ticketDateObj = new Date(ticketYear, ticketMonth - 1, ticketDate.getDate());
    
    return ticketDateObj >= startDate && ticketDateObj <= endDate;
  });

  if (filteredTickets.length === 0) {
    throw new Error('Nenhum chamado encontrado para o período selecionado');
  }

  // Preparar dados no formato da planilha
  const excelData = filteredTickets.map(ticket => ({
    'ID': ticket.id,
    'Título': ticket.title,
    'Técnico': ticket.technician,
    'Setor': ticket.sector,
    'Usuário': ticket.user_name,
    'Status': ticket.status,
    'Categoria': ticket.category,
    'Prioridade': ticket.priority,
    'Data/Hora': new Date(ticket.date_time).toLocaleString('pt-BR'),
    'Descrição': ticket.description,
    'Solução': ticket.solution
  }));

  // Criar workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Configurar largura das colunas
  const colWidths = [
    { wch: 8 },  // ID
    { wch: 25 }, // Título
    { wch: 20 }, // Técnico
    { wch: 20 }, // Setor
    { wch: 20 }, // Usuário
    { wch: 15 }, // Status
    { wch: 15 }, // Categoria
    { wch: 12 }, // Prioridade
    { wch: 20 }, // Data/Hora
    { wch: 40 }, // Descrição
    { wch: 40 }  // Solução
  ];
  ws['!cols'] = colWidths;

  // Adicionar worksheet ao workbook
  const sheetName = `Chamados_${options.startMonth}-${options.startYear}_a_${options.endMonth}-${options.endYear}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Gerar nome do arquivo
  const fileName = `chamados_${options.startMonth}-${options.startYear}_a_${options.endMonth}-${options.endYear}.xlsx`;

  // Fazer download
  XLSX.writeFile(wb, fileName);

  return fileName;
};

export const saveMonthlyBackup = (tickets: Ticket[], month: number, year: number) => {
  // Filtrar tickets do mês específico
  const monthlyTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.date_time);
    return ticketDate.getMonth() + 1 === month && ticketDate.getFullYear() === year;
  });

  if (monthlyTickets.length === 0) return;

  // Preparar dados
  const excelData = monthlyTickets.map(ticket => ({
    'ID': ticket.id,
    'Título': ticket.title,
    'Técnico': ticket.technician,
    'Setor': ticket.sector,
    'Usuário': ticket.user_name,
    'Status': ticket.status,
    'Categoria': ticket.category,
    'Prioridade': ticket.priority,
    'Data/Hora': new Date(ticket.date_time).toLocaleString('pt-BR'),
    'Descrição': ticket.description,
    'Solução': ticket.solution
  }));

  // Salvar no localStorage como backup mensal
  const backupKey = `backup_${month}_${year}`;
  localStorage.setItem(backupKey, JSON.stringify(excelData));
};