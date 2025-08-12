import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export function useApi<T>(resource: string, initialLoad = true) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getAll<T>(resource);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  const createItem = useCallback(async (item: Partial<T>) => {
    try {
      const newItem = await apiService.create<T>(resource, item);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
      throw err;
    }
  }, [resource]);

  const updateItem = useCallback(async (id: number, item: Partial<T>) => {
    try {
      const updatedItem = await apiService.update<T>(resource, id, item);
      setData(prev => prev.map((existing: any) => 
        existing[`id_${resource.slice(0, -1)}`] === id ? updatedItem : existing
      ));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
      throw err;
    }
  }, [resource]);

  const deleteItem = useCallback(async (id: number) => {
    try {
      await apiService.delete(resource, id);
      setData(prev => prev.filter((item: any) => 
        item[`id_${resource.slice(0, -1)}`] !== id
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      throw err;
    }
  }, [resource]);

  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [fetchData, initialLoad]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
}

export function useEquivalencias() {
  const [equivalencias, setEquivalencias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEquivalencias = useCallback(async (codigo: string) => {
    if (!codigo.trim()) {
      setEquivalencias([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.searchEquivalencias(codigo);
      setEquivalencias(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      setEquivalencias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    equivalencias,
    loading,
    error,
    searchEquivalencias,
  };
}