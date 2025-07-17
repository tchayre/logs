import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

import { Ticket } from '../services/supabase';

interface ChartsProps {
  tickets: Ticket[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ tickets }) => {
  // Dados para gráfico de barras - Chamados por Técnico
  const technicianData = tickets.reduce((acc, ticket) => {
    acc[ticket.technician] = (acc[ticket.technician] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const technicianChart = {
    labels: Object.keys(technicianData),
    datasets: [
      {
        label: 'Chamados',
        data: Object.values(technicianData),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de pizza - Status
  const statusData = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChart = {
    labels: Object.keys(statusData),
    datasets: [
      {
        data: Object.values(statusData),
        backgroundColor: [
          '#3B82F6', // Azul
          '#8B5CF6', // Roxo
          '#F59E0B', // Amarelo
          '#10B981', // Verde
          '#6B7280', // Cinza
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Dados para gráfico de linha - Chamados por mês
  const monthlyData = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.date_time);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.split('/').map(Number);
    const [monthB, yearB] = b.split('/').map(Number);
    return yearA - yearB || monthA - monthB;
  });

  const monthlyChart = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Chamados por Mês',
        data: sortedMonths.map(month => monthlyData[month]),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Dados para gráfico de barras - Prioridades
  const priorityData = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChart = {
    labels: Object.keys(priorityData),
    datasets: [
      {
        label: 'Chamados por Prioridade',
        data: Object.values(priorityData),
        backgroundColor: [
          '#10B981', // Verde - Baixa
          '#F59E0B', // Amarelo - Média
          '#F97316', // Laranja - Alta
          '#EF4444', // Vermelho - Crítica
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <p>Nenhum dado disponível para gráficos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados por Técnico</h3>
        <div className="h-64">
          <Bar data={technicianChart} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Chamados</h3>
        <div className="h-64">
          <Doughnut data={statusChart} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h3>
        <div className="h-64">
          <Line data={monthlyChart} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados por Prioridade</h3>
        <div className="h-64">
          <Bar data={priorityChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};