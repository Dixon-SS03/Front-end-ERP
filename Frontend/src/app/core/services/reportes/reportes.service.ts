import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FiltrosCubo {
  fechaInicio?: Date;
  fechaFin?: Date;
  agrupacion?: string;
}

export interface MetricasFinancieras {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  margenGanancia: number;
  cantidadFacturas: number;
  cantidadPagos: number;
  promedioIngreso: number;
  promedioEgreso: number;
}

export interface AnalisisPeriodo {
  periodo: string;
  ingresos: number;
  egresos: number;
  balance: number;
  margenGanancia: number;
  cantidadFacturas: number;
  cantidadPagos: number;
}

export interface DashboardEjecutivo {
  metricas: MetricasFinancieras;
  analisisPorPeriodo: AnalisisPeriodo[];
  topIngresos: any[];
  topEgresos: any[];
}

export interface ComparacionPeriodos {
  periodo1: MetricasFinancieras;
  periodo2: MetricasFinancieras;
  diferencias: {
    ingresos: number;
    egresos: number;
    balance: number;
    margenGanancia: number;
  };
  porcentajes: {
    ingresos: number;
    egresos: number;
    balance: number;
    margenGanancia: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = `${environment.apiUrl}/Reportes`;

  constructor(private http: HttpClient) {}

  getDashboardEjecutivo(filtros?: FiltrosCubo): Observable<DashboardEjecutivo> {
    return this.http.get<DashboardEjecutivo>(`${this.apiUrl}/dashboard-ejecutivo`, {
      params: this.buildParams(filtros)
    });
  }

  getMetricasGenerales(filtros?: FiltrosCubo): Observable<MetricasFinancieras> {
    return this.http.get<MetricasFinancieras>(`${this.apiUrl}/metricas-generales`, {
      params: this.buildParams(filtros)
    });
  }

  getAnalisisPorPeriodo(filtros?: FiltrosCubo): Observable<AnalisisPeriodo[]> {
    return this.http.get<AnalisisPeriodo[]>(`${this.apiUrl}/analisis-periodo`, {
      params: this.buildParams(filtros)
    });
  }

  getMesActual(): Observable<MetricasFinancieras> {
    return this.http.get<MetricasFinancieras>(`${this.apiUrl}/mes-actual`);
  }

  getAñoActual(): Observable<AnalisisPeriodo[]> {
    return this.http.get<AnalisisPeriodo[]>(`${this.apiUrl}/año-actual`);
  }

  getComparacionMensual(): Observable<ComparacionPeriodos> {
    return this.http.get<ComparacionPeriodos>(`${this.apiUrl}/comparacion-mensual`);
  }

  getUltimosMeses(meses: number = 6): Observable<AnalisisPeriodo[]> {
    return this.http.get<AnalisisPeriodo[]>(`${this.apiUrl}/ultimos-meses`, {
      params: { meses: meses.toString() }
    });
  }

  getIngresosVsEgresos(filtros?: FiltrosCubo): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingresos-vs-egresos`, {
      params: this.buildParams(filtros)
    });
  }

  private buildParams(filtros?: FiltrosCubo): any {
    if (!filtros) return {};

    const params: any = {};
    
    if (filtros.fechaInicio) {
      params.fechaInicio = filtros.fechaInicio.toISOString();
    }
    if (filtros.fechaFin) {
      params.fechaFin = filtros.fechaFin.toISOString();
    }
    if (filtros.agrupacion) {
      params.agrupacion = filtros.agrupacion;
    }

    return params;
  }
}
