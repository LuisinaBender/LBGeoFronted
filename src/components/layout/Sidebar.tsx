import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  RefreshCw, 
  Truck, 
  UserCheck,
  Home,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'repuestos', label: 'Repuestos', icon: Package },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'equivalencias', label: 'Equivalencias', icon: RefreshCw },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'usuarios', label: 'Usuarios', icon: UserCheck },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="bg-slate-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <Logo size="lg" />
        <p className="text-slate-400 text-sm mt-2">Sistema de Gestión</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          © 2024 LBGeo
        </div>
      </div>
    </div>
  );
}