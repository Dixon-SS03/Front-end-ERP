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
  cargando = false;

  constructor(
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    console.log('Constructor ejecutado');
  }

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    console.log('cargando categorias');
    this.cargando = true;
    this.categorias = []; // Limpiar array

    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        console.log('Tipo de data:', typeof data);
        console.log('Es array?:', Array.isArray(data));

        // Asegurarse de que sea un array
        this.categorias = Array.isArray(data) ? data : [data];
        this.cargando = false;

        console.log('Categorías asignadas:', this.categorias);
        console.log('Length:', this.categorias.length);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        alert('Error al cargar las categorías');
        this.cargando = false;
        this.categorias = [];
      }
    });
  }

  crear(): void {
    this.router.navigate(['/categorias/crear']);
  }

  editar(categoria: Categorias): void {
    this.router.navigate(['/categorias/editar', categoria.id]);
  }

  eliminar(categoria: Categorias): void {
    if (confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriasService.deleteCategoria(categoria.id).subscribe({
        next: () => {
          alert('Categoría eliminada exitosamente');
          this.cargarCategorias();
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }

  // Método helper para debugging
  get tieneCategorias(): boolean {
    return this.categorias && this.categorias.length > 0;
  }

  trackByCategoria(index: number, categoria: Categorias): number {
    return categoria.id;
  }
}
