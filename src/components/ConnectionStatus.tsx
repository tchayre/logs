import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await apiService.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Verificar conexão inicial
    checkConnection();

    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Verificando conexão...
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
        <WifiOff className="w-4 h-4" />
        Servidor offline
        <button
          onClick={checkConnection}
          className="ml-2 px-2 py-1 bg-red-200 hover:bg-red-300 rounded text-xs transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
      <Wifi className="w-4 h-4" />
      Conectado
    </div>
  );
};

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved?: Date;
  error?: string | null;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving, lastSaved, error }) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
        <AlertCircle className="w-4 h-4" />
        Erro ao salvar
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        Salvando...
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Salvo {lastSaved.toLocaleTimeString()}
      </div>
    );
  }

  return null;
};