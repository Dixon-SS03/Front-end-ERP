import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "app-recursos-humanos-usuarios",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  estado: string = '';
  rol: string = '';
  identificacion: string = '';
  puesto: string = '';
  telefono: string = '';
  fechaActual: string = '';

  // 📋 Lista de usuarios
  listaUsuarios: any[] = [];

  constructor() {
    this.fechaActual = this.obtenerFechaActual();
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');  
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
    }

    // 🧠 Registrar usuario
  onSubmit() {
    if (!this.nombre || !this.correo || !this.rol) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const nuevoUsuario = {
      Id: this.listaUsuarios.length + 1,
      Nombre: this.nombre,
      Correo: this.correo,
      Estado: this.estado === 'admin' ? 'Activo' : 'Inactivo',
      Rol: this.rol,
      Puesto: this.puesto,
      Identificacion: this.identificacion,
      Telefono: this.telefono,
      FechaRegistro: new Date()
    };

    this.listaUsuarios.push(nuevoUsuario);
    console.log('✅ Usuario agregado:', nuevoUsuario);

    // Limpia los campos
    this.nombre = '';
    this.correo = '';
    this.contrasena = '';
    this.estado = '';
    this.rol = '';
    this.identificacion = '';
    this.puesto = '';
    this.telefono = '';
  }

  // ✏️ Editar usuario (ficticio por ahora)
  editarUsuario(id: number) {
    console.log('✏️ Editar usuario con ID:', id);
    alert(`Función de editar usuario ID: ${id} (pendiente de implementar)`);
  }

  // ❌ Eliminar usuario
  eliminarUsuario(id: number) {
    const confirmar = confirm(`¿Desea eliminar el usuario con ID ${id}?`);
    if (confirmar) {
      this.listaUsuarios = this.listaUsuarios.filter(u => u.Id !== id);
      console.log('🗑️ Usuario eliminado:', id);
    }
  }

}