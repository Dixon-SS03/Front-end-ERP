export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
  stock: number;
  categoriaId: number; // ⚠️ CAMBIAR de id_categoria a categoriaId
  estado: string;
  categoria?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}
