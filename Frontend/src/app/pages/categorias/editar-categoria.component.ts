import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';
import { Categorias } from '../../shared/models/Categorias.model';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {
  categoriaForm: FormGroup;
  loading = false;
  categoriaId!: number;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.minLength(3)]
    });
  }

  ngOnInit(): void {
    this.categoriaId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📝 Editando categoría ID:', this.categoriaId);
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.loading = true;

    this.categoriasService.getCategoria(this.categoriaId).subscribe({
      next: (categoria: Categorias) => {
        console.log('✅ Categoría cargada:', categoria);

        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || ''
        });

        this.loading = false;
        console.log('📝 Formulario actualizado:', this.categoriaForm.value);
      },
      error: (err) => {
        console.error('❌ Error al cargar categoría:', err);
        alert('Error al cargar la categoría');
        this.router.navigate(['/dashboard/inventario/categorias']);
      }
    });
  }

  onSubmit(): void {
    console.log('=== SUBMIT EDITAR CATEGORÍA ===');
    console.log('Formulario válido?', this.categoriaForm.valid);
    console.log('Valores:', this.categoriaForm.value);

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const categoriaActualizada: Categorias = {
      id: this.categoriaId,
      nombre: this.categoriaForm.value.nombre,
      descripcion: this.categoriaForm.value.descripcion || ''
    };

    console.log('📤 Enviando al backend:', categoriaActualizada);

    this.categoriasService.updateCategoria(this.categoriaId, categoriaActualizada).subscribe({
      next: () => {
        console.log('✅ Categoría actualizada exitosamente');
        alert('Categoría actualizada exitosamente');
        this.router.navigate(['/dashboard/inventario/categorias']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar categoría:', err);
        alert('Error al actualizar la categoría');
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/inventario/categorias']);
  }
}
