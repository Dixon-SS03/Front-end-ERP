import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../shared/models/Producto.model';
import { Categorias } from '../../shared/models/Categorias.model';
import { forkJoin } from 'rxjs';

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
    console.log('Cargando productos...');
    this.loading = true;
    this.error = null;

    this.productosService.getProductos().subscribe({
      next: (data: any[]) => {
        console.log('=== DATOS RECIBIDOS DEL BACKEND ===');
        console.log('Productos cargados:', data);

        // Mostrar el primer producto completo para ver la estructura
        if (data.length > 0) {
          console.log('Primer producto completo:', JSON.stringify(data[0], null, 2));
        }

        // Mapear productos con nombre de categoría
        this.productos = data.map((producto, index) => {
          console.log(`Producto ${index}:`, producto.nombre);
          console.log(`  - categoriaId:`, producto.categoriaId);
          console.log(`  - categoria:`, producto.categoria);
          console.log(`  - Categoria:`, producto.Categoria);

          let categoriaNombre = 'Sin categoría';

          // Intentar diferentes formas de acceder a la categoría
          if (producto.categoria && producto.categoria.nombre) {
            categoriaNombre = producto.categoria.nombre;
            console.log(`  ✓ Encontrado en categoria.nombre: ${categoriaNombre}`);
          } else if (producto.Categoria && producto.Categoria.nombre) {
            categoriaNombre = producto.Categoria.nombre;
            console.log(`  ✓ Encontrado en Categoria.nombre: ${categoriaNombre}`);
          } else if (producto.categoria && producto.categoria.Nombre) {
            categoriaNombre = producto.categoria.Nombre;
            console.log(`  ✓ Encontrado en categoria.Nombre: ${categoriaNombre}`);
          } else if (producto.Categoria && producto.Categoria.Nombre) {
            categoriaNombre = producto.Categoria.Nombre;
            console.log(`  ✓ Encontrado en Categoria.Nombre: ${categoriaNombre}`);
          } else {
            console.log(`  ✗ No se encontró categoría`);
          }

          return {
            ...producto,
            categoriaNombre: categoriaNombre
          };
        });

        console.log('=== PRODUCTOS PROCESADOS ===');
        console.log('Productos finales:', this.productos);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  getNombreCategoria(producto: ProductoConCategoria): string {
    return producto.categoriaNombre || 'Sin categoría';
  }

  editarProducto(id: number): void {
    console.log('Editando producto:', id);
    this.router.navigate(['/productos/editar', id]);
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      console.log('Eliminando producto:', id);
      this.loading = true;

      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado exitosamente');
          alert('Producto eliminado exitosamente');
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el producto');
          this.loading = false;
        }
      });
    }
  }

  crearProducto(): void {
    this.router.navigate(['/productos/crear']);
  }
}
