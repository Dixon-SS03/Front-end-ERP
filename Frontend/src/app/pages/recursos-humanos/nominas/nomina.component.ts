import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NominaService } from '../../../core/services/nomina/nomina.service';
import { UsuarioService } from '../../../core/services/usuarios/usuario.services';
import { Nomina, NominaCreateDTO, PagoNominaDTO } from '../../../shared/models/Nomina.model';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {
  id_usuario: number | null = null;
  periodo_inicio: string = '';
  periodo_fin: string = '';
  salario_bruto: number | null = null;
  salario_neto: number | null = null;
  fecha_pago: string = '';
  editMode = false;
  nominaEditId: number | null = null;

  showPaymentModal = false;
  selectedNominaId: number | null = null;
  metodo_pago: string = 'Transferencia';
  fecha_pago_custom: string = '';
  metodoPagoOptions = ['Efectivo', 'Transferencia', 'Cheque', 'Deposito', 'Tarjeta'];

  listaNominas: Nomina[] = [];
  listaUsuarios: any[] = [];
  
  vistaActual: 'todas' | 'pendientes' | 'pagadas' = 'todas';
  usuarioFiltro: number | null = null;

  constructor(
    private nominaService: NominaService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.showNominas();
    this.showUsuarios();
  }

  showNominas() {
    if (this.vistaActual === 'pendientes') {
      this.nominaService.getNominasPendientes().subscribe({
        next: (data) => {
          this.listaNominas = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al obtener nóminas pendientes:', err)
      });
    } else {
      this.nominaService.getNominas().subscribe({
        next: (data) => {
          if (this.vistaActual === 'pagadas') {
            this.listaNominas = data.filter((n: any) => n.estaPagada === true);
          } else {
            this.listaNominas = data;
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al obtener nóminas:', err)
      });
    }
  }

  showUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data.filter((u: any) => u.estado === 1);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  cambiarVista(vista: 'todas' | 'pendientes' | 'pagadas') {
    this.vistaActual = vista;
    this.showNominas();
  }

  onSubmit() {
    if (!this.id_usuario || !this.periodo_inicio || !this.periodo_fin || 
        !this.salario_bruto || !this.salario_neto || !this.fecha_pago) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nominaData: NominaCreateDTO = {
      UsuarioId: this.id_usuario,
      Periodo_Inicio: new Date(this.periodo_inicio).toISOString(),
      Periodo_Fin: new Date(this.periodo_fin).toISOString(),
      Salario_Bruto: this.salario_bruto,
      Salario_Neto: this.salario_neto,
      Fecha_Pago: new Date(this.fecha_pago).toISOString()
    };

    if (this.editMode && this.nominaEditId) {
      this.updateNomina(nominaData);
    } else {
      this.createNomina(nominaData);
    }
  }

  createNomina(nominaData: NominaCreateDTO) {
    this.nominaService.createNomina(nominaData).subscribe({
      next: () => {
        alert('Nómina creada exitosamente');
        this.limpiarFormulario();
        this.showNominas();
      },
      error: (err) => {
        console.error('Error al crear nómina:', err);
        console.error('Detalles del error:', err.error);
        console.error('Errores de validación:', err.error?.errors);
        const errorMsg = err.error?.mensaje || err.error?.title || err.error?.errors 
          ? JSON.stringify(err.error.errors) 
          : 'Error desconocido';
        alert('Error al crear nómina: ' + errorMsg);
      }
    });
  }

  updateNomina(nominaData: NominaCreateDTO) {
    if (!this.nominaEditId) return;

    this.nominaService.updateNomina(this.nominaEditId, nominaData).subscribe({
      next: () => {
        alert('Nómina actualizada exitosamente');
        this.limpiarFormulario();
        this.showNominas();
      },
      error: (err) => {
        console.error('Error al actualizar nómina:', err);
        alert('Error al actualizar nómina: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  editarNomina(nomina: any) {
    this.editMode = true;
    this.nominaEditId = nomina.id;
    this.id_usuario = nomina.usuarioId;
    this.periodo_inicio = this.formatDateForInput(nomina.periodo_Inicio);
    this.periodo_fin = this.formatDateForInput(nomina.periodo_Fin);
    this.salario_bruto = nomina.salario_Bruto;
    this.salario_neto = nomina.salario_Neto;
    this.fecha_pago = this.formatDateForInput(nomina.fecha_Pago);
    
    this.cdr.detectChanges();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarNomina(id: number) {
    if (!confirm('¿Está seguro de eliminar esta nómina?')) return;

    this.nominaService.deleteNomina(id).subscribe({
      next: () => {
        alert('Nómina eliminada exitosamente');
        this.showNominas();
      },
      error: (err) => {
        console.error('Error al eliminar nómina:', err);
        alert('Error al eliminar nómina: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  abrirModalPago(nominaId: number) {
    this.selectedNominaId = nominaId;
    this.showPaymentModal = true;
    this.metodo_pago = 'Transferencia';
    this.fecha_pago_custom = '';
  }

  cerrarModalPago() {
    this.showPaymentModal = false;
    this.selectedNominaId = null;
    this.metodo_pago = 'Transferencia';
    this.fecha_pago_custom = '';
  }

  procesarPago() {
    if (!this.selectedNominaId) return;

    const pagoData: any = {
      NominaId: this.selectedNominaId,
      Metodo_Pago: this.metodo_pago
    };

    if (this.fecha_pago_custom && this.fecha_pago_custom.trim() !== '') {
      pagoData.Fecha_Pago = this.fecha_pago_custom + 'T00:00:00';
    }

    this.nominaService.procesarPago(pagoData).subscribe({
      next: (response) => {
        alert(`Pago procesado exitosamente\n${response.mensaje}\nEmpleado: ${response.empleadoNombre}\nMonto: $${response.monto}`);
        this.cerrarModalPago();
        this.showNominas();
      },
      error: (err) => {
        console.error('Error al procesar pago:', err);
        console.error('Errores de validación detallados:', err.error?.errors);
        
        let errorMsg = 'Error desconocido';
        
        if (err.error?.mensaje) {
          errorMsg = err.error.mensaje;
          if (err.error?.fechaPagoPrevio) {
            errorMsg += `\n\nFecha pago previo: ${err.error.fechaPagoPrevio}\nMonto: $${err.error.montoPagado}`;
          }
          if (err.error?.periodoFin) {
            errorMsg += `\n\nFin de período: ${err.error.periodoFin}`;
          }
        } else if (err.error?.title) {
          errorMsg = err.error.title;
        } else if (err.error?.errors) {
          errorMsg = 'Errores de validación:\n' + JSON.stringify(err.error.errors, null, 2);
        } else if (typeof err.error === 'string') {
          errorMsg = err.error;
        }
        
        alert('Error al procesar pago:\n' + errorMsg);
      }
    });
  }

  limpiarFormulario() {
    this.id_usuario = null;
    this.periodo_inicio = '';
    this.periodo_fin = '';
    this.salario_bruto = null;
    this.salario_neto = null;
    this.fecha_pago = '';
    this.editMode = false;
    this.nominaEditId = null;
    this.cdr.detectChanges();
  }

  formatDateForInput(date: Date | string): string {
    if (!date) return '';
    
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        console.error('Fecha inválida:', date);
        return '';
      }
      return d.toISOString().slice(0, 10);
    } catch (error) {
      console.error('Error al formatear fecha:', error, date);
      return '';
    }
  }

  getNombreUsuario(nomina: Nomina): string {
    if (nomina.empleadoNombre) {
      return nomina.empleadoNombre;
    }
    const usuario = this.listaUsuarios.find(u => u.id === nomina.usuarioId);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  calcularDescuentos() {
    if (this.salario_bruto) {
      this.salario_neto = this.salario_bruto * 0.85;
    }
  }
}
