import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/login']);
  }

  services = [
    {
      icon: '',
      title: 'Recursos Humanos',
      description: 'Gestión completa de personal, asistencias, horarios y nóminas.',
      features: ['Control de asistencias', 'Gestión de horarios', 'Administración de usuarios', 'Cálculo de nóminas']
    },
    {
      icon: '',
      title: 'Inventario',
      description: 'Control total de productos, stock y movimientos de almacén.',
      features: ['Gestión de productos', 'Control de stock', 'Alertas de inventario', 'Reportes detallados']
    },
    {
      icon: '',
      title: 'Finanzas',
      description: 'Administración financiera, presupuestos y análisis de costos.',
      features: ['Control de presupuestos', 'Gestión de pagos', 'Facturación', 'Reportes financieros']
    },
    {
      icon: '',
      title: 'Reportes y Análisis',
      description: 'Reportes detallados y análisis de datos en tiempo real.',
      features: ['Dashboards interactivos', 'Reportes personalizados', 'Análisis de tendencias', 'Exportación de datos']
    }
  ];

  features = [
    { icon: '', title: 'Seguro y Confiable', description: 'Sistema con autenticación robusta y control de accesos' },
    { icon: '', title: 'Rápido y Eficiente', description: 'Optimizado para un rendimiento superior' },
    { icon: '', title: 'Responsive', description: 'Accesible desde cualquier dispositivo' },
    { icon: '', title: 'Actualizado', description: 'Tecnologías modernas y actualizadas' }
  ];
}
