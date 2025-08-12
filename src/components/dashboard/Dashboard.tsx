import React from 'react';
import { Users, Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

function StatCard({ title, value, icon, color, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data: clientes = [] } = useApi('clientes');
  const { data: repuestos = [] } = useApi('repuestos');
  const { data: ventas = [] } = useApi('ventas');

  const totalVentas = ventas.reduce((sum: number, venta: any) => sum + (venta.precio_total || 0), 0);
  const repuestosBajoStock = repuestos.filter((repuesto: any) => repuesto.stock < 10).length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Resumen general de tu sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clientes"
          value={clientes.length}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          change="+12% este mes"
        />
        <StatCard
          title="Repuestos en Stock"
          value={repuestos.length}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-green-500"
          change="+5% este mes"
        />
        <StatCard
          title="Ventas Realizadas"
          value={ventas.length}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          change="+18% este mes"
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${totalVentas.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-amber-500"
          change="+23% este mes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Nueva venta registrada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Cliente agregado</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Stock actualizado</p>
                <p className="text-xs text-gray-500">Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Stock</h3>
          <div className="space-y-4">
            {repuestosBajoStock > 0 ? (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {repuestosBajoStock} repuestos con stock bajo
                  </p>
                  <p className="text-xs text-red-600">Se requiere reabastecimiento</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Stock en niveles óptimos
                  </p>
                  <p className="text-xs text-green-600">Todos los repuestos disponibles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}