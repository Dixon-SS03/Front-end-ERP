import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { FormComponent } from './pages/recursos-humanos/usuarios/form.component';
import { HorarioComponent } from './pages/recursos-humanos/horarios/horario.component';
import { AsistenciaComponent } from './pages/recursos-humanos/asistencias/asistencia.component';
import { NominaComponent } from './pages/recursos-humanos/nominas/nomina.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardEjecutivoComponent } from './pages/dashboard-ejecutivo/dashboard-ejecutivo.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardEjecutivoComponent },
      { path: 'recursos-humanos/usuarios', component: FormComponent },
      { path: 'recursos-humanos/horarios', component: HorarioComponent },
      { path: 'recursos-humanos/asistencias', component: AsistenciaComponent },
      { path: 'recursos-humanos/nominas', component: NominaComponent },
    ],
  },
  { path: '**', redirectTo: '' }
];
