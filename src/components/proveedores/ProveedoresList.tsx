import React, { useState } from 'react';
import { Plus, Edit, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { Proveedor } from '../../types';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Modal } from '../common/Modal';
import { ProveedorForm } from './ProveedorForm';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function ProveedoresList() {
  const { data: proveedores, loading, error, createItem, updateItem, deleteItem } = useApi<Proveedor>('proveedores');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  const filteredProveedores = proveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proveedor.telefono.includes(searchQuery)
  );

  const handleCreate = () => {
    setEditingProveedor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setIsModalOpen(true);
  };

  const handleDelete = async (proveedor: Proveedor) => {
    if (window.confirm(`¿Estás seguro de eliminar al proveedor "${proveedor.nombre}"?`)) {
      try {
        await deleteItem(proveedor.id_proveedor);
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
      }
    }
  };

  const handleSubmit = async (proveedorData: any) => {
    try {
      if (editingProveedor) {
        await updateItem(editingProveedor.id_proveedor, proveedorData);
      } else {
        await createItem(proveedorData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proveedores</h2>
          <p className="text-gray-600">Gestiona la red de proveedores de repuestos</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Proveedor</span>
        </Button>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por nombre, email o teléfono..."
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProveedores.map((proveedor) => (
          <div key={proveedor.id_proveedor} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{proveedor.nombre}</h3>
                  <p className="text-sm text-gray-500">Proveedor ID: {proveedor.id_proveedor}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(proveedor)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(proveedor)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span className="break-all">{proveedor.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span>{proveedor.telefono}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                <span className="break-words">{proveedor.direccion}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Estado</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProveedores.length === 0 && !loading && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron proveedores</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
      >
        <ProveedorForm
          proveedor={editingProveedor}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}