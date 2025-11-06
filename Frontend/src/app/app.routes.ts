import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { FormComponent } from './pages/recursos-humanos/usuarios/form.component';
import { HorarioComponent } from './pages/recursos-humanos/horarios/horario.component';
import { AsistenciaComponent } from './pages/recursos-humanos/asistencias/asistencia.component';
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'recursos-humanos/usuarios', component: FormComponent },
       { path: 'recursos-humanos/horarios', component: HorarioComponent },
       { path: 'recursos-humanos/asistencias', component: AsistenciaComponent },
      // { path: 'inventario', component: InventarioComponent },
    ],
  },
  { path: '**', redirectTo: '' }
];
