import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Asistencia {
  id: number;
  usuario: string;
  fecha: Date;
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: string; // "Presente" | "Tarde" | "Ausente"
}

@Component({
  selector: 'app-recursos-humanos-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent {
  // === Usuarios disponibles (puedes traerlos del backend en el futuro)
  usuarios = [
    { id: 1, nombre: 'Juan Pérez', horaEntradaEsperada: '08:00' },
    { id: 2, nombre: 'María Gómez', horaEntradaEsperada: '08:00' },
    { id: 3, nombre: 'Carlos López', horaEntradaEsperada: '07:30' },
  ];

  // === Asistencias registradas
  asistencias: Asistencia[] = [
    {
      id: 1,
      usuario: 'Juan Pérez',
      fecha: new Date(),
      horaEntrada: '08:05',
      horaSalida: '16:00',
      estado: 'Presente'
    },
    {
      id: 2,
      usuario: 'María Gómez',
      fecha: new Date(),
      horaEntrada: '08:45',
      horaSalida: null,
      estado: 'Tarde'
    }
  ];

  // === Variables de formulario
  asistenciasFiltradas: Asistencia[] = [...this.asistencias];
  usuarioSeleccionado: number | null = null;
  fechaSeleccionada: string = '';
  empleadoSeleccionado: number | null = null;
  tipoMarca: 'entrada' | 'salida' = 'entrada';
  horaMarca: string = '';

  // === Filtrar por usuario o fecha
  filtrarAsistencias() {
    this.asistenciasFiltradas = this.asistencias.filter(a => {
      const coincideUsuario = this.usuarioSeleccionado
        ? a.usuario === this.usuarios.find(u => u.id === this.usuarioSeleccionado)?.nombre
        : true;

      const coincideFecha = this.fechaSeleccionada
        ? new Date(a.fecha).toDateString() === new Date(this.fechaSeleccionada).toDateString()
        : true;

      return coincideUsuario && coincideFecha;
    });
  }

  // === Registrar una asistencia (entrada/salida)
  registrarAsistencia() {
    if (!this.empleadoSeleccionado || !this.horaMarca) {
      alert('⚠️ Seleccione un usuario y una hora válida.');
      return;
    }

    const usuario = this.usuarios.find(u => u.id === this.empleadoSeleccionado);
    if (!usuario) return;

    const hoy = new Date();
    const asistenciaExistente = this.asistencias.find(a =>
      a.usuario === usuario.nombre &&
      new Date(a.fecha).toDateString() === hoy.toDateString()
    );

    if (this.tipoMarca === 'entrada') {
      if (asistenciaExistente) {
        asistenciaExistente.horaEntrada = this.horaMarca;
        asistenciaExistente.estado = this.calcularEstado(usuario.horaEntradaEsperada, this.horaMarca);
      } else {
        this.asistencias.push({
          id: Date.now(),
          usuario: usuario.nombre,
          fecha: hoy,
          horaEntrada: this.horaMarca,
          horaSalida: null,
          estado: this.calcularEstado(usuario.horaEntradaEsperada, this.horaMarca)
        });
      }
    } else {
      if (asistenciaExistente) {
        asistenciaExistente.horaSalida = this.horaMarca;
      } else {
        alert('⚠️ No se puede registrar una salida sin una entrada previa.');
      }
    }

    this.resetFormulario();
    this.filtrarAsistencias();
    alert('✅ Registro de asistencia guardado correctamente.');
  }

  // === Calcular el estado del empleado
  calcularEstado(horaEsperada: string, horaReal: string): string {
    const [hE, mE] = horaEsperada.split(':').map(Number);
    const [hR, mR] = horaReal.split(':').map(Number);

    const minutosEsperados = hE * 60 + mE;
    const minutosReales = hR * 60 + mR;
    const diferencia = minutosReales - minutosEsperados;

    if (diferencia > 15) return 'Tarde';
    if (diferencia < -10) return 'Ausente';
    return 'Presente';
  }

  // === Editar asistencia (placeholder, para futuro modal)
  editarAsistencia(a: Asistencia) {
    console.log('Editar asistencia:', a);
    alert(`Editar registro de ${a.usuario}`);
  }

  // === Eliminar asistencia
  eliminarAsistencia(a: Asistencia) {
    const confirmar = confirm(`¿Eliminar registro de ${a.usuario}?`);
    if (confirmar) {
      this.asistencias = this.asistencias.filter(x => x.id !== a.id);
      this.filtrarAsistencias();
    }
  }

  // === Resetear formulario después de guardar
  private resetFormulario() {
    this.empleadoSeleccionado = null;
    this.horaMarca = '';
    this.tipoMarca = 'entrada';
  }
}
