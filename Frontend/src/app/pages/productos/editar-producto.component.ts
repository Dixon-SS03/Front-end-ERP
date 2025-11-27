import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';
import { Producto } from '../../shared/models/Producto.model';
import { Categorias } from '../../shared/models/Categorias.model';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  productoForm!: FormGroup;
  loading = false;
  error: string | null = null;
  productoId!: number;
  categorias: Categorias[] = [];
  categoriaActual: Categorias | null = null; // ✅ NUEVA PROPIEDAD

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    // Cargar categorías primero
    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('✅ Categorías cargadas:', categorias);

        // Después cargar producto
        this.cargarProducto(id);
      }
    });
  }

  cargarProducto(id: number): void {
    this.productosService.getProducto(id).subscribe({
      next: (producto: Producto) => {
        console.log('✅ Producto cargado completo:', producto);
        console.log('📂 CategoriaId recibido:', producto.categoriaId);

        // ✅ Buscar la categoría en el array ya cargado
        if (producto.categoriaId) {
          this.categoriaActual = this.categorias.find(cat => cat.id === producto.categoriaId) || null;
          console.log('📂 Categoría del producto:', this.categoriaActual);
        }

        this.productoForm.patchValue({
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio: producto.precio,
          stock: producto.stock,
          categoriaId: producto.categoriaId,
          estado: producto.estado
        });

        console.log('📝 Formulario después de patchValue:', this.productoForm.value);
      },
      error: (err) => {
        console.error('❌ Error al cargar producto:', err);
        this.error = 'Error al cargar el producto';
      }
    });
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, [Validators.required]],
      estado: ['Activo', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('=== SUBMIT EDITAR PRODUCTO ===');
    console.log('Formulario válido?', this.productoForm.valid);
    console.log('Valores del formulario:', this.productoForm.value);

    if (this.productoForm.valid) {
      const id = this.route.snapshot.params['id'];
      const productoActualizado = {
        id: Number(id),
        nombre: this.productoForm.value.nombre,
        codigo: this.productoForm.value.codigo,
        precio: Number(this.productoForm.value.precio),
        stock: Number(this.productoForm.value.stock),
        categoriaId: Number(this.productoForm.value.categoriaId),
        estado: this.productoForm.value.estado
      };

      console.log('📤 Enviando al backend:', productoActualizado);

      this.productosService.updateProducto(id, productoActualizado).subscribe({
        next: () => {
          console.log('✅ Producto actualizado exitosamente');
          this.router.navigate(['/dashboard/inventario/productos']);
        },
        error: (err) => {
          console.error('❌ Error al actualizar:', err);
          this.error = 'Error al actualizar el producto';
        }
      });
    } else {
      console.log('❌ Formulario inválido');
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard/inventario/productos']);
  }
}
