import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RoleService } from "../../../core/services/roles/rol.services";
import { PuestoService } from "../../../core/services/puestos/puesto.services";
import { UsuarioService } from "../../../core/services/usuarios/usuario.services";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: "app-recursos-humanos-usuarios",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent implements OnInit {
  nombre = '';
  correo = '';
  contrasena = '';
  identificacion = '';
  telefono = '';
  fechaActual = new Date().toISOString().slice(0, 16);
  rolId: number | null = null;
  puestoId: number | null = null;
  salario: number | null = null;
  editMode = false;
  usuarioEditId: number | null = null;

  listaUsuarios: any[] = [];
  listaRoles: any[] = [];
  listaPuestos: any[] = [];

  constructor(
    private rolService: RoleService,
    private puestoService: PuestoService,
    private usuarioService: UsuarioService,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.showRoles();
    this.showPuestos();
    this.showUsuarios();
  }

  // === Obtener datos ===
  showRoles() {
    this.rolService.getRol().subscribe({
      next: (data) => (this.listaRoles = data, this.cdr.detectChanges()),
      error: (err) => console.error("Error al obtener roles:", err),
    });
  }

  showPuestos() {
    this.puestoService.getPuesto().subscribe({
      next: (data) => (this.listaPuestos = data, this.cdr.detectChanges()),
      error: (err) => console.error("Error al obtener puestos:", err),
    });
  }

  showUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data
  .filter((u: any) => u.estado === 1) 
  .map((u: any) => ({
    ...u,
    estado: true,
  }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al obtener usuarios:", err),
    });
  }

 onPuestoChange(event: any) {
  this.puestoId = Number(event.target.value);
  const selectedPuesto = this.listaPuestos.find(p => p.id === this.puestoId);
  this.salario = selectedPuesto ? selectedPuesto.salario : null;
}

onRolChange(event: any) {
  this.rolId = Number(event.target.value);
}

limpiarFormulario() {
  this.nombre = '';
  this.correo = '';
  this.contrasena = '';
  this.identificacion = '';
  this.telefono = '';
  this.rolId = null;
  this.puestoId = null;
  this.salario = null;
  this.editMode = false;
  this.usuarioEditId = null;
  this.cdr.detectChanges();
}


 onSubmit() {
  if (!this.rolId || !this.puestoId) {
    alert("Debe seleccionar un rol y un puesto.");
    return;
  }

 const datos = {
  nombre: this.nombre,
  correo: this.correo,
  contrasena: this.contrasena,
  estado: 1,
  fecha_creacion: this.fechaActual,   
  rolId: this.rolId,
  identificacion: this.identificacion,
  puestoId: this.puestoId,
  fecha_contratacion: new Date().toISOString(),
  telefono: this.telefono
};


  if (this.editMode && this.usuarioEditId) {
    this.usuarioService.updateUsuario(this.usuarioEditId, datos).subscribe({
      next: () => {
        alert("Usuario actualizado correctamente");
        this.editMode = false;
        this.usuarioEditId = null;
        this.limpiarFormulario();
        this.showUsuarios();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al actualizar usuario:", err);
        alert(err.error?.message || "Error al actualizar");
      }
    });

  } else {
    this.usuarioService.usuarioCompleto(datos).subscribe({
      next: () => {
        alert("Usuario creado correctamente");
        this.limpiarFormulario();
        this.showUsuarios();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al crear usuario:", err);
        alert(err.error?.message || "Error al crear usuario.");
      }
    });
  }
}


  cargarUsuario(usuario: any) {
  this.editMode = true;
  this.usuarioEditId = usuario.id;

  this.nombre = usuario.nombre;
  this.correo = usuario.correo;
  this.contrasena = usuario.contrasena;
  this.rolId = usuario.rolId;

  this.identificacion = usuario.datosEmpleado?.identificacion || '';
  this.puestoId = usuario.datosEmpleado?.puestoId || usuario.datosEmpleado?.puesto?.id || null;
  this.telefono = usuario.datosEmpleado?.telefono || '';

  this.salario = usuario.datosEmpleado?.puesto?.salario || null;

  this.fechaActual = new Date(usuario.fecha_creacion).toISOString().slice(0, 16);
}

eliminarUsuario(id: number) {
  if (!confirm("¿Seguro que desea desactivar este usuario?")) {
    return;
  }

  this.usuarioService.deleteUsuario(id).subscribe({
    next: (res) => {
      alert("Usuario desactivado correctamente");
      this.showUsuarios();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Error al desactivar usuario:", err);
      alert("Error al desactivar usuario");
    }
  });
}

}
