import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';
import { Categorias} from '../../shared/models/Categorias.model';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {
  form: FormGroup;
  categoriaId!: number;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.categoriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.loading = true;
    this.categoriasService.getCategoria(this.categoriaId).subscribe({
      next: (categoria) => {
        this.form.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la categoría';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const categoria: Categorias = {
        id: this.categoriaId,
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion
      };

      this.categoriasService.updateCategoria(this.categoriaId, categoria).subscribe({
        next: (response) => {
          alert('Categoría actualizada exitosamente');
          this.router.navigate(['/categorias']);
        },
        error: (err) => {
          this.error = 'Error al actualizar la categoría';
          console.error('Error:', err);
          this.loading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/categorias']);
  }
}
