import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';
import { Categorias} from '../../shared/models/Categorias.model';

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
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['']
    });
  }

  guardarCategoria(): void {
    if (this.categoriaForm.valid) {
      this.loading = true;
      this.error = null;

      const categoria: Categorias = {
        id: 0,
        nombre: this.categoriaForm.value.nombre,
        descripcion: this.categoriaForm.value.descripcion
      };

      this.categoriasService.createCategoria(categoria).subscribe({
        next: (response) => {
          alert('Categoría creada exitosamente');
          this.router.navigate(['/categorias']);
        },
        error: (err) => {
          this.error = 'Error al crear la categoría';
          console.error('Error:', err);
          this.loading = false;
        }
      });
    } else {
      this.categoriaForm.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/categorias']);
  }
}
