const API_BASE_URL = 'https://datalbgeo.azurewebsites.net/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Generic CRUD operations
  async getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(`/${resource}`);
  }

  async getById<T>(resource: string, id: number): Promise<T> {
    return this.request<T>(`/${resource}/${id}`);
  }

  async create<T>(resource: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<T>(resource: string, id: number, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(resource: string, id: number): Promise<void> {
    return this.request<void>(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  // Specific search operations
  async searchEquivalencias(codigo: string): Promise<string[]> {
    return this.request<string[]>(`/equivalencias/search?codigo=${encodeURIComponent(codigo)}`);
  }

  async searchRepuestos(query: string): Promise<any[]> {
    return this.request<any[]>(`/repuestos/search?q=${encodeURIComponent(query)}`);
  }

  // Sales specific operations
  async createVenta(ventaData: any): Promise<any> {
    return this.request<any>('/ventas', {
      method: 'POST',
      body: JSON.stringify(ventaData),
    });
  }

  async getVentasWithDetails(): Promise<any[]> {
    return this.request<any[]>('/ventas?include=cliente,repuesto');
  }
}

export const apiService = new ApiService();