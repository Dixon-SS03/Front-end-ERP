import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../shared/models/Producto.model';

interface ProductoConCategoria extends Producto {
  categoriaNombre?: string;
}

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  productos: ProductoConCategoria[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    console.log('🔄 Iniciando carga de productos...');
    this.loading = true;
    this.error = null;

    this.productosService.getProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos recibidos del backend:', productos);

        // Mapear productos con nombre de categoría
        this.productos = productos.map((producto) => {
          let categoriaNombre = 'Sin categoría';

          // Intentar obtener el nombre de la categoría
          if (producto.categoria?.nombre) {
            categoriaNombre = producto.categoria.nombre;
          }

          return {
            ...producto,
            categoriaNombre
          };
        });

        console.log('✅ Productos procesados:', this.productos.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  getNombreCategoria(producto: ProductoConCategoria): string {
    return producto.categoriaNombre || 'Sin categoría';
  }

  editarProducto(id: number): void {
    console.log('✏️ Editando producto:', id);
    this.router.navigate(['/dashboard/inventario/productos/editar', id]);
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      console.log('🗑️ Eliminando producto:', id);
      this.loading = true;

      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado');
          alert('Producto eliminado exitosamente');
          this.cargarProductos();
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
          alert('Error al eliminar el producto');
          this.loading = false;
        }
      });
    }
  }

  crearProducto(): void {
    this.router.navigate(['/dashboard/inventario/productos/nuevo']);
  }
}
