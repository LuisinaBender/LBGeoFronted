import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ClientesList } from './components/clientes/ClientesList';
import { RepuestosList } from './components/repuestos/RepuestosList';
import { VentasList } from './components/ventas/VentasList';
import { EquivalenciasList } from './components/equivalencias/EquivalenciasList';
import { ProveedoresList } from './components/proveedores/ProveedoresList';
import { UsuariosList } from './components/usuarios/UsuariosList';

const tabTitles = {
  dashboard: 'Dashboard',
  clientes: 'Gestión de Clientes',
  repuestos: 'Gestión de Repuestos',
  ventas: 'Gestión de Ventas',
  equivalencias: 'Gestión de Equivalencias',
  proveedores: 'Gestión de Proveedores',
  usuarios: 'Gestión de Usuarios',
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <ClientesList />;
      case 'repuestos':
        return <RepuestosList />;
      case 'ventas':
        return <VentasList />;
      case 'equivalencias':
        return <EquivalenciasList />;
      case 'proveedores':
        return <ProveedoresList />;
      case 'usuarios':
        return <UsuariosList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header title={tabTitles[activeTab as keyof typeof tabTitles] || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;