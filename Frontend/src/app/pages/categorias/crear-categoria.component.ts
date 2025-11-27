import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css']
})
export class CrearCategoriaComponent {
  categoriaForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.minLength(3)]
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.categoriasService.createCategoria(this.categoriaForm.value).subscribe({
      next: () => {
        alert('Categoría creada exitosamente');
        this.router.navigate(['/dashboard/inventario/categorias']);
      },
      error: (err) => {
        console.error('❌ Error al crear categoría:', err);
        alert('Error al crear la categoría');
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/inventario/categorias']);
  }
}
