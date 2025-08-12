import React, { useState, useEffect } from 'react';
import { Equivalencia, EquivalenciaForm as EquivalenciaFormType } from '../../types';
import { Button } from '../common/Button';

interface EquivalenciaFormProps {
  equivalencia?: Equivalencia | null;
  onSubmit: (data: EquivalenciaFormType) => Promise<void>;
  onCancel: () => void;
}

export function EquivalenciaForm({ equivalencia, onSubmit, onCancel }: EquivalenciaFormProps) {
  const [formData, setFormData] = useState<EquivalenciaFormType>({
    codigo_OEM_original: '',
    codigo_OEM_equivalente: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EquivalenciaFormType>>({});

  useEffect(() => {
    if (equivalencia) {
      setFormData({
        codigo_OEM_original: equivalencia.codigo_OEM_original,
        codigo_OEM_equivalente: equivalencia.codigo_OEM_equivalente,
      });
    }
  }, [equivalencia]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EquivalenciaFormType> = {};

    if (!formData.codigo_OEM_original.trim()) {
      newErrors.codigo_OEM_original = 'El código OEM original es requerido';
    }
    if (!formData.codigo_OEM_equivalente.trim()) {
      newErrors.codigo_OEM_equivalente = 'El código OEM equivalente es requerido';
    }
    if (formData.codigo_OEM_original === formData.codigo_OEM_equivalente) {
      newErrors.codigo_OEM_equivalente = 'Los códigos no pueden ser iguales';
    }

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
      console.error('Error al guardar equivalencia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof EquivalenciaFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código OEM Original *
          </label>
          <input
            type="text"
            value={formData.codigo_OEM_original}
            onChange={(e) => handleChange('codigo_OEM_original', e.target.value.toUpperCase())}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
              errors.codigo_OEM_original ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: 04465-02140"
          />
          {errors.codigo_OEM_original && (
            <p className="text-red-500 text-xs mt-1">{errors.codigo_OEM_original}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Ingresa el código OEM del fabricante original
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código OEM Equivalente *
          </label>
          <input
            type="text"
            value={formData.codigo_OEM_equivalente}
            onChange={(e) => handleChange('codigo_OEM_equivalente', e.target.value.toUpperCase())}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
              errors.codigo_OEM_equivalente ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: BP4K-33-23Z"
          />
          {errors.codigo_OEM_equivalente && (
            <p className="text-red-500 text-xs mt-1">{errors.codigo_OEM_equivalente}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Ingresa el código equivalente de otro fabricante
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Información sobre equivalencias</h4>
            <div className="text-sm text-blue-700 mt-1">
              Las equivalencias permiten encontrar repuestos compatibles de diferentes fabricantes. 
              Una vez creadas, se podrán buscar automáticamente desde cualquier código.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {equivalencia ? 'Actualizar' : 'Crear'} Equivalencia
        </Button>
      </div>
    </form>
  );
}