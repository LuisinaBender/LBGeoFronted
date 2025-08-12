import React, { useState, useEffect } from 'react';
import { VentaForm as VentaFormType } from '../../types';
import { Button } from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { Calculator, Package, User } from 'lucide-react';

interface VentaFormProps {
  onSubmit: (data: VentaFormType & { precio_total: number }) => Promise<void>;
  onCancel: () => void;
}

export function VentaForm({ onSubmit, onCancel }: VentaFormProps) {
  const { data: clientes } = useApi('clientes');
  const { data: repuestos } = useApi('repuestos');
  
  const [formData, setFormData] = useState<VentaFormType>({
    id_repuesto: 0,
    id_cliente: 0,
    cantidad: 1,
    precio_unitario: 0,
    fecha_venta: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VentaFormType>>({});
  const [selectedRepuesto, setSelectedRepuesto] = useState<any>(null);

  const precioTotal = formData.cantidad * formData.precio_unitario;

  useEffect(() => {
    if (formData.id_repuesto) {
      const repuesto = repuestos.find((r: any) => r.id_repuesto === formData.id_repuesto);
      if (repuesto) {
        setSelectedRepuesto(repuesto);
        setFormData(prev => ({
          ...prev,
          precio_unitario: repuesto.precio
        }));
      }
    } else {
      setSelectedRepuesto(null);
    }
  }, [formData.id_repuesto, repuestos]);

  const validateForm = (): boolean => {
    const newErrors: Partial<VentaFormType> = {};

    if (!formData.id_cliente) newErrors.id_cliente = 'Selecciona un cliente';
    if (!formData.id_repuesto) newErrors.id_repuesto = 'Selecciona un repuesto';
    if (formData.cantidad <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    if (formData.precio_unitario <= 0) newErrors.precio_unitario = 'El precio debe ser mayor a 0';
    if (!formData.fecha_venta) newErrors.fecha_venta = 'La fecha es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const ventaData = {
        ...formData,
        precio_total: precioTotal
      };
      await onSubmit(ventaData);
    } catch (error) {
      console.error('Error al registrar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof VentaFormType, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Cliente *
          </label>
          <select
            value={formData.id_cliente}
            onChange={(e) => handleChange('id_cliente', parseInt(e.target.value) || 0)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.id_cliente ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={0}>Seleccionar cliente</option>
            {clientes.map((cliente: any) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} {cliente.apellido} - {cliente.email}
              </option>
            ))}
          </select>
          {errors.id_cliente && <p className="text-red-500 text-xs mt-1">{errors.id_cliente}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Package className="w-4 h-4 inline mr-1" />
            Repuesto *
          </label>
          <select
            value={formData.id_repuesto}
            onChange={(e) => handleChange('id_repuesto', parseInt(e.target.value) || 0)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.id_repuesto ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={0}>Seleccionar repuesto</option>
            {repuestos.map((repuesto: any) => (
              <option key={repuesto.id_repuesto} value={repuesto.id_repuesto}>
                {repuesto.texto} - {repuesto.marca_auto} {repuesto.modelo_auto} (${repuesto.precio})
              </option>
            ))}
          </select>
          {errors.id_repuesto && <p className="text-red-500 text-xs mt-1">{errors.id_repuesto}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad *
          </label>
          <input
            type="number"
            min="1"
            value={formData.cantidad}
            onChange={(e) => handleChange('cantidad', parseInt(e.target.value) || 1)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cantidad ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="1"
          />
          {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Unitario *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio_unitario}
            onChange={(e) => handleChange('precio_unitario', parseFloat(e.target.value) || 0)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.precio_unitario ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.precio_unitario && <p className="text-red-500 text-xs mt-1">{errors.precio_unitario}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Venta *
          </label>
          <input
            type="date"
            value={formData.fecha_venta}
            onChange={(e) => handleChange('fecha_venta', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.fecha_venta ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.fecha_venta && <p className="text-red-500 text-xs mt-1">{errors.fecha_venta}</p>}
        </div>
      </div>

      {/* Selected Product Details */}
      {selectedRepuesto && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Detalles del Repuesto Seleccionado</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Descripción:</span>
              <p className="font-medium text-blue-900">{selectedRepuesto.texto}</p>
            </div>
            <div>
              <span className="text-blue-700">Código OEM:</span>
              <p className="font-mono text-blue-900">{selectedRepuesto.codigo_OEM_original}</p>
            </div>
            <div>
              <span className="text-blue-700">Vehículo:</span>
              <p className="font-medium text-blue-900">
                {selectedRepuesto.marca_auto} {selectedRepuesto.modelo_auto} ({selectedRepuesto.año})
              </p>
            </div>
            <div>
              <span className="text-blue-700">Motor:</span>
              <p className="font-medium text-blue-900">{selectedRepuesto.motor}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price Calculation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-900">Cálculo del Total</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-700">
              {formData.cantidad} × ${formData.precio_unitario.toLocaleString()} = 
            </div>
            <div className="text-2xl font-bold text-green-900">
              ${precioTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Registrar Venta
        </Button>
      </div>
    </form>
  );
}