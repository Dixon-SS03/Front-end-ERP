import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  productoForm: FormGroup;
  categorias: Categorias[] = [];
  productoId!: number;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['Activo', [Validators.required]],
      categoriaId: [0, [Validators.required, Validators.min(1)]] // ← Cambiar de id_categoria a categoriaId
    });
  }

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Producto ID a editar:', this.productoId);

    if (!this.productoId || isNaN(this.productoId)) {
      alert('ID de producto inválido');
      this.router.navigate(['/productos']);
      return;
    }

    this.cargarCategorias();
    this.cargarProducto();
  }

  cargarCategorias(): void {
    console.log('Cargando categorías...');
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        console.log('✅ Categorías cargadas:', data);
        this.categorias = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('❌ Error al cargar categorías:', err);
        alert('Error al cargar las categorías');
      }
    });
  }

  cargarProducto(): void {
    console.log('Cargando producto ID:', this.productoId);
    this.loading = true;
    this.error = null;

    this.productosService.getProducto(this.productoId).subscribe({
      next: (producto) => {
        console.log('✅ Producto cargado:', producto);

        // Cargar los datos en el formulario
        this.productoForm.patchValue({
          nombre: producto.nombre,
          codigo: producto.codigo,
          precio: producto.precio,
          stock: producto.stock,
          estado: producto.estado,
          categoriaId: producto.categoriaId // ← Asegúrate de usar categoriaId
        });

        console.log('Formulario actualizado:', this.productoForm.value);
        console.log('CategoriaId seleccionado:', this.productoForm.value.categoriaId);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto';
        console.error('❌ Error al cargar producto:', err);
        alert('No se pudo cargar el producto');
        this.loading = false;
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit(): void {
    console.log('=== SUBMIT EDITAR ===');
    console.log('Formulario válido?', this.productoForm.valid);
    console.log('Valores del formulario:', this.productoForm.value);

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();

      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });

      alert('Por favor complete todos los campos correctamente');
      return;
    }

    this.loading = true;
    this.error = null;

    const productoActualizado: Producto = {
      id: this.productoId,
      nombre: this.productoForm.value.nombre,
      codigo: this.productoForm.value.codigo,
      precio: Number(this.productoForm.value.precio),
      stock: Number(this.productoForm.value.stock),
      estado: this.productoForm.value.estado,
      categoriaId: Number(this.productoForm.value.categoriaId)
    };

    console.log('Producto a actualizar:', productoActualizado);

    this.productosService.updateProducto(this.productoId, productoActualizado).subscribe({
      next: (response) => {
        console.log('✅ Producto actualizado:', response);
        alert('Producto actualizado exitosamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar:', err);
        console.error('Error body:', err.error);

        let mensaje = 'Error al actualizar el producto';

        if (err.status === 400) {
          if (err.error && err.error.errors) {
            const errores = Object.values(err.error.errors).flat().join(', ');
            mensaje = `Errores de validación: ${errores}`;
          } else if (err.error && err.error.message) {
            mensaje = `Error: ${err.error.message}`;
          }
        } else if (err.status === 404) {
          mensaje = 'Producto no encontrado';
        }

        this.error = mensaje;
        alert(mensaje);
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }
}
