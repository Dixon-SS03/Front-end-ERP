import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService, MetricasFinancieras, AnalisisPeriodo } from '../../core/services/reportes/reportes.service';

@Component({
  selector: 'app-dashboard-ejecutivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-ejecutivo.component.html',
  styleUrls: ['./dashboard-ejecutivo.component.css']
})
export class DashboardEjecutivoComponent implements OnInit {
  metricas: MetricasFinancieras | null = null;
  analisisMensual: AnalisisPeriodo[] = [];
  isLoading: boolean = true;
  error: string = '';

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    this.error = '';

    this.reportesService.getMesActual().subscribe({
      next: (metricas) => {
        this.metricas = metricas;
      },
      error: (error) => {
        console.error('Error al cargar métricas:', error);
        this.error = 'Error al cargar las métricas financieras';
      }
    });

    this.reportesService.getUltimosMeses(6).subscribe({
      next: (analisis) => {
        this.analisisMensual = analisis;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar análisis:', error);
        this.error = 'Error al cargar el análisis mensual';
        this.isLoading = false;
      }
    });
  }

  formatCurrency(value: number | undefined | null): string {
    if (value === undefined || value === null) return '₡0.00';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC  '
    }).format(value);
  }

  formatPercent(value: number | undefined | null): string {
    if (value === undefined || value === null) return '0.00%';
    return `${value.toFixed(2)}%`;
  }

  getTendencia(index: number): string {
    if (index === 0 || !this.analisisMensual[index - 1]) return 'neutral';
    
    const actual = this.analisisMensual[index].balance;
    const anterior = this.analisisMensual[index - 1].balance;
    
    return actual > anterior ? 'up' : actual < anterior ? 'down' : 'neutral';
  }
}
