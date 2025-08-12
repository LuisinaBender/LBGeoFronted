import React, { useState, useEffect } from 'react';
import { Repuesto, RepuestoForm as RepuestoFormType } from '../../types';
import { Button } from '../common/Button';
import { useApi } from '../../hooks/useApi';

interface RepuestoFormProps {
  repuesto?: Repuesto | null;
  onSubmit: (data: RepuestoFormType) => Promise<void>;
  onCancel: () => void;
}

export function RepuestoForm({ repuesto, onSubmit, onCancel }: RepuestoFormProps) {
  const { data: equivalencias } = useApi('equivalencias');
  const [formData, setFormData] = useState<RepuestoFormType>({
    texto: '',
    marca_auto: '',
    modelo_auto: '',
    codigo_OEM_original: '',
    marca_OEM: '',
    año: '',
    motor: '',
    imagen_url: '',
    id_equivalencia: 0,
    precio: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RepuestoFormType>>({});

  useEffect(() => {
    if (repuesto) {
      setFormData({
        texto: repuesto.texto,
        marca_auto: repuesto.marca_auto,
        modelo_auto: repuesto.modelo_auto,
        codigo_OEM_original: repuesto.codigo_OEM_original,
        marca_OEM: repuesto.marca_OEM,
        año: repuesto.año,
        motor: repuesto.motor,
        imagen_url: repuesto.imagen_url,
        id_equivalencia: repuesto.id_equivalencia,
        precio: repuesto.precio,
      });
    }
  }, [repuesto]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RepuestoFormType> = {};

    if (!formData.texto.trim()) newErrors.texto = 'La descripción es requerida';
    if (!formData.marca_auto.trim()) newErrors.marca_auto = 'La marca del auto es requerida';
    if (!formData.modelo_auto.trim()) newErrors.modelo_auto = 'El modelo del auto es requerido';
    if (!formData.codigo_OEM_original.trim()) newErrors.codigo_OEM_original = 'El código OEM es requerido';
    if (!formData.marca_OEM.trim()) newErrors.marca_OEM = 'La marca OEM es requerida';
    if (!formData.año.trim()) newErrors.año = 'El año es requerido';
    if (!formData.motor.trim()) newErrors.motor = 'El motor es requerido';
    if (formData.precio <= 0) newErrors.precio = 'El precio debe ser mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar repuesto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RepuestoFormType, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Repuesto *
          </label>
          <input
            type="text"
            value={formData.texto}
            onChange={(e) => handleChange('texto', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.texto ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Pastillas de freno delanteras"
          />
          {errors.texto && <p className="text-red-500 text-xs mt-1">{errors.texto}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca del Auto *
          </label>
          <input
            type="text"
            value={formData.marca_auto}
            onChange={(e) => handleChange('marca_auto', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.marca_auto ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Toyota, Honda, Ford"
          />
          {errors.marca_auto && <p className="text-red-500 text-xs mt-1">{errors.marca_auto}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo del Auto *
          </label>
          <input
            type="text"
            value={formData.modelo_auto}
            onChange={(e) => handleChange('modelo_auto', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.modelo_auto ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Corolla, Civic, Focus"
          />
          {errors.modelo_auto && <p className="text-red-500 text-xs mt-1">{errors.modelo_auto}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código OEM Original *
          </label>
          <input
            type="text"
            value={formData.codigo_OEM_original}
            onChange={(e) => handleChange('codigo_OEM_original', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.codigo_OEM_original ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: 04465-02140"
          />
          {errors.codigo_OEM_original && <p className="text-red-500 text-xs mt-1">{errors.codigo_OEM_original}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca OEM *
          </label>
          <input
            type="text"
            value={formData.marca_OEM}
            onChange={(e) => handleChange('marca_OEM', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.marca_OEM ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Akebono, Bosch, Denso"
          />
          {errors.marca_OEM && <p className="text-red-500 text-xs mt-1">{errors.marca_OEM}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año *
          </label>
          <input
            type="text"
            value={formData.año}
            onChange={(e) => handleChange('año', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.año ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: 2015-2020"
          />
          {errors.año && <p className="text-red-500 text-xs mt-1">{errors.año}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motor *
          </label>
          <input
            type="text"
            value={formData.motor}
            onChange={(e) => handleChange('motor', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.motor ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: 2.0L, 1.8L Turbo"
          />
          {errors.motor && <p className="text-red-500 text-xs mt-1">{errors.motor}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => handleChange('precio', parseFloat(e.target.value) || 0)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.precio ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equivalencia
          </label>
          <select
            value={formData.id_equivalencia}
            onChange={(e) => handleChange('id_equivalencia', parseInt(e.target.value) || 0)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Sin equivalencia</option>
            {equivalencias.map((equiv: any) => (
              <option key={equiv.id_equivalencia} value={equiv.id_equivalencia}>
                {equiv.codigo_OEM_original} → {equiv.codigo_OEM_equivalente}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de Imagen
          </label>
          <input
            type="url"
            value={formData.imagen_url}
            onChange={(e) => handleChange('imagen_url', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {formData.imagen_url && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vista previa
            </label>
            <img
              src={formData.imagen_url}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {repuesto ? 'Actualizar' : 'Crear'} Repuesto
        </Button>
      </div>
    </form>
  );
}