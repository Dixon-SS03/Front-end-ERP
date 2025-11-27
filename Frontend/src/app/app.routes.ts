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

      // Rutas de Recursos Humanos
      { path: 'recursos-humanos/usuarios', component: FormComponent },
      { path: 'recursos-humanos/horarios', component: HorarioComponent },
      { path: 'recursos-humanos/asistencias', component: AsistenciaComponent },
      { path: 'recursos-humanos/nominas', component: NominaComponent },

      // Rutas de Inventario - Productos
      {
        path: 'inventario/productos',
        loadComponent: () => import('./pages/productos/listar-productos.component').then(m => m.ListarProductosComponent)
      },
      {
        path: 'inventario/productos/nuevo',
        loadComponent: () => import('./pages/productos/crear-producto.component').then(m => m.CrearProductoComponent)
      },
      {
        path: 'inventario/productos/editar/:id',
        loadComponent: () => import('./pages/productos/editar-producto.component').then(m => m.EditarProductoComponent),
        runGuardsAndResolvers: 'always'
      },

      // Rutas de Inventario - Categorías
      {
        path: 'inventario/categorias',
        loadComponent: () => import('./pages/categorias/listar-categorias').then(m => m.ListarCategoriasComponent)
      },
      {
        path: 'inventario/categorias/nueva',
        loadComponent: () => import('./pages/categorias/crear-categoria.component').then(m => m.CrearCategoriaComponent)
      },
      {
        path: 'inventario/categorias/editar/:id',
        loadComponent: () => import('./pages/categorias/editar-categoria.component').then(m => m.EditarCategoriaComponent),
        runGuardsAndResolvers: 'always'
      },
    ],
  },
  { path: '**', redirectTo: '' }
];
