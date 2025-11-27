import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';
import { Categorias } from '../../shared/models/Categorias.model';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-categorias.component.html',
  styleUrls: ['./listar-categorias.component.css']
})
export class ListarCategoriasComponent implements OnInit {
  categorias: Categorias[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;
    this.error = null;

    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar categorías:', err);
        this.error = 'Error al cargar las categorías';
        this.loading = false;
      }
    });
  }

  crearCategoria(): void {
    this.router.navigate(['/dashboard/inventario/categorias/nuevo']);
  }

  editarCategoria(id: number): void {
    this.router.navigate(['/dashboard/inventario/categorias/editar', id]);
  }

  eliminarCategoria(id: number, nombre: string): void {
    if (confirm(`¿Está seguro de eliminar la categoría "${nombre}"?`)) {
      this.loading = true;

      this.categoriasService.deleteCategoria(id).subscribe({
        next: () => {
          alert('Categoría eliminada exitosamente');
          this.cargarCategorias();
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
          alert('Error al eliminar la categoría');
          this.loading = false;
        }
      });
    }
  }
}
