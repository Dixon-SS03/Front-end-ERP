import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuarios/usuario.services';
import { HorarioService } from '../../../core/services/horarios-asistencias/horario.service';

interface HorarioAsignado {
  dia: string;
  horaEntrada: string;
  horaSalida: string;
  observaciones?: string;
}

@Component({
  selector: 'app-recursos-humanos-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {

  usuarios: any[] = [];

  diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  usuarioSeleccionado: number | null = null;
  horariosAsignados: HorarioAsignado[] = [];

  mostrarFormulario = false;
  usuarioExpandido: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }


  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuarios.forEach(u => this.cargarHorariosUsuario(u));
      },
      error: (err) => console.error("Error cargando usuarios:", err)
    });
  }


  cargarHorariosUsuario(usuario: any) {
    this.horarioService.getHorariosByUsuario(usuario.id).subscribe({
      next: (horarios) => {
        usuario.horarios = horarios || [];
      },
      error: (err) => console.error("Error cargando horarios:", err)
    });
  }


  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  
  toggleDia(dia: string) {
    const index = this.horariosAsignados.findIndex(h => h.dia === dia);

    if (index === -1) {
      this.horariosAsignados.push({
        dia,
        horaEntrada: '',
        horaSalida: '',
        observaciones: ''
      });
    } else {
      this.horariosAsignados.splice(index, 1);
    }
  }

  diaSeleccionado(dia: string): boolean {
    return this.horariosAsignados.some(h => h.dia === dia);
  }

  
  guardarAsignacion() {
    if (!this.usuarioSeleccionado) {
      alert("Seleccione un usuario");
      return;
    }

    if (this.horariosAsignados.length === 0) {
      alert("Seleccione al menos un día");
      return;
    }

    const dto = {
      usuarioId: this.usuarioSeleccionado,
      horarios: this.horariosAsignados
    };

    this.horarioService.asignarHorarios(dto).subscribe({
      next: () => {
        alert("Horarios asignados correctamente.");

        const usuario = this.usuarios.find(u => u.id === this.usuarioSeleccionado);
        if (usuario) {
          this.cargarHorariosUsuario(usuario);
        }

        this.horariosAsignados = [];
        this.usuarioSeleccionado = null;
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error("Error asignando horarios:", err);
        alert("Error guardando horario");
      }
    });
  }

 
  toggleVerHorario(usuarioId: number) {
    this.usuarioExpandido = this.usuarioExpandido === usuarioId ? null : usuarioId;
  }
}
