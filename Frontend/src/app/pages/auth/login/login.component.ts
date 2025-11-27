import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  showContactModal: boolean = false;
  returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    const savedEmail = localStorage.getItem('savedEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true' && savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso:', response);
        
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('savedEmail', this.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('savedEmail');
        }
        
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        
        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos. Por favor completa todos los campos.';
        } else if (error.status === 500) {
          if (error.error && typeof error.error === 'string' && error.error.includes('Invalid salt version')) {
            this.errorMessage = 'Error del servidor: Las contraseñas deben estar hasheadas con BCrypt. Contacta al administrador del sistema.';
          } else {
            this.errorMessage = 'Error interno del servidor. Por favor contacta al administrador.';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el API esté en funcionamiento.';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor intenta nuevamente.';
        }
      }
    });
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithMicrosoft() {
    console.log('Login with Microsoft');
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  showCreateAccountModal() {
    this.showContactModal = true;
  }

  closeModal() {
    this.showContactModal = false;
  }

  contactSupport() {
    window.location.href = 'mailto:contacto@erppro.com?subject=Solicitud de Nueva Cuenta&body=Hola, me gustaría adquirir los servicios de ERPPro.';
    this.closeModal();
  }
}
