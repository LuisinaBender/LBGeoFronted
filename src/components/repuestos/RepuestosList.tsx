import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign, Calendar } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { Repuesto } from '../../types';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Modal } from '../common/Modal';
import { RepuestoForm } from './RepuestoForm';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function RepuestosList() {
  const { data: repuestos, loading, error, createItem, updateItem, deleteItem } = useApi<Repuesto>('repuestos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepuesto, setEditingRepuesto] = useState<Repuesto | null>(null);

  const filteredRepuestos = repuestos.filter(repuesto => 
    repuesto.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repuesto.marca_auto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repuesto.modelo_auto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repuesto.codigo_OEM_original.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repuesto.marca_OEM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingRepuesto(null);
    setIsModalOpen(true);
  };

  const handleEdit = (repuesto: Repuesto) => {
    setEditingRepuesto(repuesto);
    setIsModalOpen(true);
  };

  const handleDelete = async (repuesto: Repuesto) => {
    if (window.confirm(`¿Estás seguro de eliminar el repuesto "${repuesto.texto}"?`)) {
      try {
        await deleteItem(repuesto.id_repuesto);
      } catch (error) {
        console.error('Error al eliminar repuesto:', error);
      }
    }
  };

  const handleSubmit = async (repuestoData: any) => {
    try {
      if (editingRepuesto) {
        await updateItem(editingRepuesto.id_repuesto, repuestoData);
      } else {
        await createItem(repuestoData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar repuesto:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">Repuestos</h2>
          <p className="text-gray-600">Gestiona el inventario de repuestos</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Repuesto</span>
        </Button>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por descripción, marca, modelo o código OEM..."
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRepuestos.map((repuesto) => (
          <div key={repuesto.id_repuesto} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{repuesto.texto}</h3>
                  <p className="text-xs text-gray-500">{repuesto.marca_OEM}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(repuesto)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(repuesto)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Marca Auto:</span>
                  <p className="font-medium text-gray-900">{repuesto.marca_auto}</p>
                </div>
                <div>
                  <span className="text-gray-500">Modelo:</span>
                  <p className="font-medium text-gray-900">{repuesto.modelo_auto}</p>
                </div>
                <div>
                  <span className="text-gray-500">Año:</span>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {repuesto.año}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Motor:</span>
                  <p className="font-medium text-gray-900">{repuesto.motor}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 text-sm">Código OEM:</span>
                    <p className="font-mono text-sm text-gray-900">{repuesto.codigo_OEM_original}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-lg font-bold text-green-600">
                      <DollarSign className="w-4 h-4" />
                      {repuesto.precio.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {repuesto.imagen_url && (
                <div className="mt-3">
                  <img
                    src={repuesto.imagen_url}
                    alt={repuesto.texto}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRepuestos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron repuestos</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
        size="xl"
      >
        <RepuestoForm
          repuesto={editingRepuesto}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}