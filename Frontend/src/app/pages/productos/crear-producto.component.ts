import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';
import { Producto } from '../../shared/models/Producto.model';
import { Categorias } from '../../shared/models/Categorias.model';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  categorias: Categorias[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['Activo', [Validators.required]],
      categoriaId: [0, [Validators.required, Validators.min(1)]]  // ← Cambiar aquí
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    console.log('Cargando categorías...');
    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        console.log('✅ Categorías recibidas:', data);
        this.categorias = Array.isArray(data) ? data : [];
        console.log('Categorías asignadas:', this.categorias);
      },
      error: (err) => {
        console.error('❌ Error al cargar categorías:', err);
        alert('Error al cargar las categorías');
      }
    });
  }

  guardarProducto(): void {
    console.log('=== INICIO GUARDADO ===');
    console.log('Formulario válido?', this.productoForm.valid);
    console.log('Valores del formulario:', this.productoForm.value);
    console.log('CategoriaId del formulario:', this.productoForm.value.categoriaId);
    console.log('Tipo de CategoriaId:', typeof this.productoForm.value.categoriaId);

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      alert('Por favor complete todos los campos correctamente');
      return;
    }

    this.loading = true;

    const nuevoProducto: Producto = {
      id: 0,
      nombre: this.productoForm.value.nombre,
      codigo: this.productoForm.value.codigo,
      precio: Number(this.productoForm.value.precio),
      stock: Number(this.productoForm.value.stock),
      estado: this.productoForm.value.estado,
      id_categoria: Number(this.productoForm.value.id_categoria)
    };

    console.log('Producto a enviar:', nuevoProducto);
    console.log('CategoriaId convertido:', nuevoProducto.id_categoria);
    console.log('Categorías disponibles:', this.categorias);

    this.productosService.createProducto(nuevoProducto).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa:', response);
        alert('Producto creado exitosamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        console.error('Error body:', err.error);

        let mensaje = 'Error al crear el producto';

        if (err.status === 400) {
          if (err.error && err.error.errors) {
            const errores = Object.values(err.error.errors).flat().join(', ');
            mensaje = `Errores de validación: ${errores}`;
          } else if (err.error && err.error.message) {
            mensaje = `Error: ${err.error.message}`;
          }
        }

        alert(mensaje);
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }
}
