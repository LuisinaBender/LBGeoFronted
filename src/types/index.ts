// Base types for all entities
export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  nro_documento: string;
}

export interface Equivalencia {
  id_equivalencia: number;
  codigo_OEM_equivalente: string;
  codigo_OEM_original: string;
}

export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Registro {
  id_registro: number;
  id_registro_venta: number;
  id_repuesto: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
}

export interface Venta {
  id_registro_venta: number;
  id_repuesto: number;
  id_cliente: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  fecha_venta: string;
  // Populated fields
  cliente?: Cliente;
  repuesto?: Repuesto;
}

export interface Repuesto {
  id_repuesto: number;
  texto: string;
  marca_auto: string;
  modelo_auto: string;
  codigo_OEM_original: string;
  marca_OEM: string;
  año: string;
  motor: string;
  imagen_url: string;
  id_equivalencia: number;
  precio: number;
  // Populated fields
  equivalencia?: Equivalencia;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  rol: string;
  email: string;
}

// Form types for creating/updating
export type ClienteForm = Omit<Cliente, 'id_cliente'>;
export type EquivalenciaForm = Omit<Equivalencia, 'id_equivalencia'>;
export type ProveedorForm = Omit<Proveedor, 'id_proveedor'>;
export type RepuestoForm = Omit<Repuesto, 'id_repuesto' | 'equivalencia'>;
export type VentaForm = Omit<Venta, 'id_registro_venta' | 'precio_total' | 'cliente' | 'repuesto'>;
export type UsuarioForm = Omit<Usuario, 'id_usuario'>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EquivalenciaSearch {
  codigo_OEM: string;
  equivalencias: string[];
}