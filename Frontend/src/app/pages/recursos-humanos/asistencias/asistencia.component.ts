import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuarios/usuario.services';
import { AsistenciaService } from '../../../core/services/horarios-asistencias/asistencia.service';
import { HorarioService } from '../../../core/services/horarios-asistencias/horario.service';

interface AsistenciaFront {
  id: number;
  usuario: string;
  usuarioId: number;
  fecha: Date;
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: string;
}

@Component({
  selector: 'app-recursos-humanos-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {

  usuarios: any[] = [];
  asistencias: AsistenciaFront[] = [];
  asistenciasFiltradas: AsistenciaFront[] = [];

  horariosUsuario: any[] = [];
  horarioSeleccionado: number | null = null;

  usuarioSeleccionado: number | null = null;
  fechaSeleccionada: string = '';

  empleadoSeleccionado: number | null = null;
  tipoMarca: 'entrada' | 'salida' = 'entrada';
  horaMarca: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private asistenciaService: AsistenciaService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarAsistencias();
    
    const ahora = new Date();
    this.horaMarca = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    console.log('🔍 Verificando conexión con el backend...');
    console.log('URL del API:', 'http://localhost:5135/api/Asistencias');
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.map((u: any) => ({
          id: u.id,
          nombre: u.nombre
        }));
      },
      error: (err) => {
        console.error("Error cargando usuarios:", err);}
    });
  }


  onSelectEmpleado() {

    
    if (!this.empleadoSeleccionado) {
      console.log('No hay empleado seleccionado');
      return;
    }

    console.log('Cargando horarios para usuario:', this.empleadoSeleccionado);
    this.horarioService.getHorariosByUsuario(this.empleadoSeleccionado).subscribe({
      next: h => {
        console.log('Horarios recibidos:', h);
        this.horariosUsuario = h;
        this.horarioSeleccionado = null; 
      },
      error: err => {
        console.error("Error cargando horarios:", err);
        alert('Error al cargar horarios: ' + (err.error?.message || err.message));
      }
    });
  }

  cargarAsistencias() {
    this.asistenciaService.getAsistencias().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        console.log('📋 Primer registro completo:', JSON.stringify(data[0], null, 2));
        
        this.asistencias = data.map((a: any) => {
          
          return {
            id: a.id,
            usuarioId: a.usuarioId ?? 0,
            usuario: a.usuarioNombre ?? "Sin nombre",
            fecha: new Date(a.fecha),
            horaEntrada: a.horaEntrada,
            horaSalida: a.horaSalida,
            estado: a.estado
          };
        });

        this.asistenciasFiltradas = [...this.asistencias];
        console.log('Asistencias mapeadas:', this.asistencias);
      },
      error: (err) => {
        console.error("Error cargando asistencias:", err);
        alert("Error al cargar asistencias: " + (err.error?.message || err.message));
      }
    });
  }

  filtrarAsistencias() {
    this.asistenciasFiltradas = this.asistencias.filter(a => {
      const coincideUsuario = this.usuarioSeleccionado
        ? a.usuarioId === this.usuarioSeleccionado
        : true;

      const coincideFecha = this.fechaSeleccionada
        ? new Date(a.fecha).toDateString() === new Date(this.fechaSeleccionada).toDateString()
        : true;

      return coincideUsuario && coincideFecha;
    });
  }


  registrarAsistencia() {
    console.log(' Iniciando registro de asistencia...');
    console.log('Empleado seleccionado (raw):', this.empleadoSeleccionado, typeof this.empleadoSeleccionado);
    console.log('Horario seleccionado (raw):', this.horarioSeleccionado, typeof this.horarioSeleccionado);
    console.log('Hora seleccionada:', this.horaMarca);
    console.log('Tipo de marca:', this.tipoMarca);
    
    if (!this.empleadoSeleccionado || !this.horaMarca) {
      alert('Seleccione un usuario y una hora válida.');
      return;
    }

    if (this.tipoMarca === 'entrada' && !this.horarioSeleccionado) {
      alert("Debe seleccionar un horario válido para registrar entrada.");
      return;
    }

    const empleadoId = Number(this.empleadoSeleccionado);
    const horarioId = Number(this.horarioSeleccionado);

    console.log('Empleado ID convertido:', empleadoId, typeof empleadoId);
    console.log('Horario ID convertido:', horarioId, typeof horarioId);

    const usuario = this.usuarios.find(u => u.id === empleadoId);
    if (!usuario) {
      console.error('Usuario no encontrado');
      console.log('Usuarios disponibles:', this.usuarios);
      return;
    }
    
    console.log('Usuario encontrado:', usuario);

    if (this.tipoMarca === 'entrada') {

      const fechaHoy = new Date();
      const [horas, minutos] = this.horaMarca.split(':');
      fechaHoy.setHours(Number(horas), Number(minutos), 0, 0);

      console.log('Hora construida:', fechaHoy.toISOString());
      console.log('Hora local:', fechaHoy.toLocaleString());

      const bodyEntrada = {
        usuarioId: empleadoId,
        horarioId: horarioId,
        horaEntrada: fechaHoy.toISOString(), 
        observaciones: ''
      };

      console.log('Enviando datos de entrada:', bodyEntrada);

      this.asistenciaService.registrarEntrada(bodyEntrada).subscribe({
        next: res => {
          console.log('Respuesta del servidor:', res);
          alert(`Entrada registrada correctamente\nEstado: ${res.estado}\nHora: ${res.horaEntrada}`);
          this.cargarAsistencias();
          this.resetFormulario();
        },
        error: err => {
          console.error("Error registrando entrada:", err);
          const mensaje = err.error?.message || err.message || 'Error desconocido';
          alert(`Error registrando entrada:\n${mensaje}`);
        }
      });
    }

    // Marcar salida
    else {

      console.log('Buscando asistencia de hoy para registrar salida...');
      console.log('Asistencias disponibles:', this.asistencias);
      
      const hoy = this.obtenerFechaHoyLocal();
      console.log('Fecha de hoy (local):', hoy.toDateString());

      const asistencia = this.asistencias.find(a => {
        const fechaAsistencia = new Date(a.fecha);
        const esHoy = this.esMismaFecha(fechaAsistencia, hoy);
        
        console.log(`Comparando: Asistencia ID ${a.id}, Usuario ${a.usuarioId}, Fecha: ${fechaAsistencia.toDateString()} ${esHoy ? '✅ ES HOY' : '❌ NO ES HOY'}`);
        
        return a.usuarioId === empleadoId &&
               esHoy &&
               a.horaEntrada !== null && 
               a.horaEntrada !== undefined &&
               a.horaEntrada !== ''; 
      });

      console.log('Asistencia encontrada:', asistencia);

      if (!asistencia) {
        alert("No se puede registrar salida sin entrada previa.\nDebe registrar primero la entrada de hoy con una hora válida.");
        return;
      }

      if (asistencia.horaSalida) {
        alert("La salida ya fue registrada anteriormente.");
        return;
      }

      console.log('Registrando salida para asistencia:', asistencia.id);

      const fechaHoy = new Date();
      const [horas, minutos] = this.horaMarca.split(':');
      fechaHoy.setHours(Number(horas), Number(minutos), 0, 0);

      console.log('Hora salida construida:', fechaHoy.toISOString());
      console.log('Hora salida local:', fechaHoy.toLocaleString());

      this.asistenciaService.registrarSalida(asistencia.id, {
        horaSalida: fechaHoy.toISOString(),
        observaciones: ''
      }).subscribe({
        next: res => {
          console.log('Respuesta del servidor:', res);
          alert(`Salida registrada correctamente\nHora: ${res.horaSalida}`);
          this.cargarAsistencias();
          this.resetFormulario();
        },
        error: err => {
          console.error("Error registrando salida:", err);
          const mensaje = err.error?.message || err.message || 'Error desconocido';
          alert(`Error registrando salida:\n${mensaje}`);
        }
      });
    }

  }

  eliminarAsistencia(a: AsistenciaFront) {
    if (!confirm(`¿Eliminar registro de ${a.usuario}?`)) return;

    this.asistenciaService.deleteAsistencia(a.id).subscribe({
      next: () => {
        alert("Asistencia eliminada");
        this.cargarAsistencias();
      },
      error: (err) => console.error("Error al eliminar asistencia:", err)
    });
  }

  private resetFormulario() {
    this.empleadoSeleccionado = null;
    
    const ahora = new Date();
    this.horaMarca = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    this.tipoMarca = 'entrada';
    this.horarioSeleccionado = null;
    this.horariosUsuario = [];
  }

 
  formatearHora(fecha: string | null | undefined): string {
    if (!fecha) return '—';
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return '—';
      
      const horas = date.getHours().toString().padStart(2, '0');
      const minutos = date.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    } catch {
      return '—';
    }
  }

  private esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getDate() === fecha2.getDate();
  }


  private obtenerFechaHoyLocal(): Date {
    const ahora = new Date();
    return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  }
}
