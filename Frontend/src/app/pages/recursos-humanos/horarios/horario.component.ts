import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HorarioAsignado {
  dia: string;
  horaEntrada: string;
  horaSalida: string;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  estado: string;
  horarios?: HorarioAsignado[];
}

@Component({
  selector: 'app-recursos-humanos-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {
  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      rol: 'Administrador',
      estado: 'Activo',
      horarios: [
        { dia: 'Lunes', horaEntrada: '08:00', horaSalida: '16:00' },
        { dia: 'Martes', horaEntrada: '08:00', horaSalida: '16:00' }
      ]
    },
    {
      id: 2,
      nombre: 'María Gómez',
      rol: 'Recursos Humanos',
      estado: 'Activo',
      horarios: []
    }
  ];

  diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  usuarioSeleccionado: number | null = null;
  horariosAsignados: HorarioAsignado[] = [];
  mostrarFormulario = false;
  usuarioExpandido: number | null = null;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  toggleDia(dia: string) {
    const index = this.horariosAsignados.findIndex(h => h.dia === dia);
    if (index === -1) {
      this.horariosAsignados.push({ dia, horaEntrada: '', horaSalida: '' });
    } else {
      this.horariosAsignados.splice(index, 1);
    }
  }

  diaSeleccionado(dia: string): boolean {
    return this.horariosAsignados.some(h => h.dia === dia);
  }

  guardarAsignacion() {
    if (!this.usuarioSeleccionado) {
      alert('Seleccione un usuario.');
      return;
    }
    const usuario = this.usuarios.find(u => u.id === this.usuarioSeleccionado);
    if (usuario) usuario.horarios = [...this.horariosAsignados];
    this.horariosAsignados = [];
    this.usuarioSeleccionado = null;
    this.mostrarFormulario = false;
    alert('✅ Horarios asignados correctamente.');
  }

  toggleVerHorario(usuarioId: number) {
    this.usuarioExpandido = this.usuarioExpandido === usuarioId ? null : usuarioId;
  }
}
