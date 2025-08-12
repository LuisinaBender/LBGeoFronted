import React, { useState, useEffect } from 'react';
import { Usuario, UsuarioForm as UsuarioFormType } from '../../types';
import { Button } from '../common/Button';

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSubmit: (data: UsuarioFormType) => Promise<void>;
  onCancel: () => void;
}

const roles = [
  { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' },
  { value: 'manager', label: 'Gerente', description: 'Gestión de inventario y ventas' },
  { value: 'employee', label: 'Empleado', description: 'Operaciones básicas' },
  { value: 'viewer', label: 'Visualizador', description: 'Solo lectura' },
];

export function UsuarioForm({ usuario, onSubmit, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState<UsuarioFormType>({
    nombre: '',
    apellido: '',
    rol: 'employee',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UsuarioFormType>>({});

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        email: usuario.email,
      });
    }
  }, [usuario]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UsuarioFormType> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.rol) newErrors.rol = 'El rol es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
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
      console.error('Error al guardar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UsuarioFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedRole = roles.find(role => role.value === formData.rol);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.nombre ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ingrese el nombre"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.apellido ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ingrese el apellido"
          />
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol del Usuario *
          </label>
          <select
            value={formData.rol}
            onChange={(e) => handleChange('rol', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.rol ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol}</p>}
        </div>
      </div>

      {selectedRole && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Rol: {selectedRole.label}
              </h4>
              <div className="text-sm text-blue-700 mt-1">
                {selectedRole.description}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Permisos por Rol</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>Administrador:</strong> Gestión completa, configuración del sistema</div>
          <div><strong>Gerente:</strong> Inventario, ventas, reportes, usuarios</div>
          <div><strong>Empleado:</strong> Ventas, consulta de inventario</div>
          <div><strong>Visualizador:</strong> Solo consulta de información</div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {usuario ? 'Actualizar' : 'Crear'} Usuario
        </Button>
      </div>
    </form>
  );
}