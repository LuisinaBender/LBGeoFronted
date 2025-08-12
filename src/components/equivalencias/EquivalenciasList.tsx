import React, { useState } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Search } from 'lucide-react';
import { useApi, useEquivalencias } from '../../hooks/useApi';
import { Equivalencia } from '../../types';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Modal } from '../common/Modal';
import { EquivalenciaForm } from './EquivalenciaForm';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function EquivalenciasList() {
  const { data: equivalencias, loading, error, createItem, updateItem, deleteItem } = useApi<Equivalencia>('equivalencias');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquivalencia, setEditingEquivalencia] = useState<Equivalencia | null>(null);
  
  // Equivalencia search functionality
  const [searchCode, setSearchCode] = useState('');
  const { equivalencias: foundEquivalencias, loading: searchLoading, searchEquivalencias } = useEquivalencias();

  const filteredEquivalencias = equivalencias.filter(equiv => 
    equiv.codigo_OEM_original.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equiv.codigo_OEM_equivalente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingEquivalencia(null);
    setIsModalOpen(true);
  };

  const handleEdit = (equivalencia: Equivalencia) => {
    setEditingEquivalencia(equivalencia);
    setIsModalOpen(true);
  };

  const handleDelete = async (equivalencia: Equivalencia) => {
    if (window.confirm(`¿Estás seguro de eliminar la equivalencia ${equivalencia.codigo_OEM_original} → ${equivalencia.codigo_OEM_equivalente}?`)) {
      try {
        await deleteItem(equivalencia.id_equivalencia);
      } catch (error) {
        console.error('Error al eliminar equivalencia:', error);
      }
    }
  };

  const handleSubmit = async (equivalenciaData: any) => {
    try {
      if (editingEquivalencia) {
        await updateItem(editingEquivalencia.id_equivalencia, equivalenciaData);
      } else {
        await createItem(equivalenciaData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar equivalencia:', error);
    }
  };

  const handleSearch = () => {
    if (searchCode.trim()) {
      searchEquivalencias(searchCode.trim());
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
          <h2 className="text-2xl font-bold text-gray-900">Equivalencias OEM</h2>
          <p className="text-gray-600">Gestiona códigos equivalentes de repuestos</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nueva Equivalencia</span>
        </Button>
      </div>

      {/* Intelligent Search Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Buscador Inteligente de Equivalencias
        </h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Ingresa un código OEM para buscar equivalencias..."
              className="block w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} loading={searchLoading}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {foundEquivalencias.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-blue-900 mb-2">Códigos equivalentes encontrados:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {foundEquivalencias.map((codigo, index) => (
                <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <span className="font-mono text-sm">{codigo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por código OEM original o equivalente..."
          className="max-w-md"
        />
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código OEM Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código OEM Equivalente
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquivalencias.map((equivalencia) => (
                <tr key={equivalencia.id_equivalencia} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <RefreshCw className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="font-mono text-sm text-gray-900">
                        {equivalencia.codigo_OEM_original}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-900">
                      {equivalencia.codigo_OEM_equivalente}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(equivalencia)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(equivalencia)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEquivalencias.length === 0 && !loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron equivalencias</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEquivalencia ? 'Editar Equivalencia' : 'Nueva Equivalencia'}
        size="lg"
      >
        <EquivalenciaForm
          equivalencia={editingEquivalencia}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}