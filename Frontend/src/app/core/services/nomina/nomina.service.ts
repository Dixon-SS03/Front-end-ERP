import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Nomina, NominaCreateDTO, PagoNominaDTO, PagoNominaResponse } from '../../../shared/models/Nomina.model';

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  private apiUrl = `${environment.apiUrl}/Nominas`;

  constructor(private http: HttpClient) {}

  getNominas(): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(this.apiUrl);
  }

  getNominaById(id: number): Observable<Nomina> {
    return this.http.get<Nomina>(`${this.apiUrl}/${id}`);
  }

  createNomina(nomina: NominaCreateDTO): Observable<Nomina> {
    return this.http.post<Nomina>(this.apiUrl, nomina);
  }

  updateNomina(id: number, nomina: NominaCreateDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { Id: id, ...nomina });
  }

  deleteNomina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  procesarPago(pagoData: PagoNominaDTO): Observable<PagoNominaResponse> {
    return this.http.post<PagoNominaResponse>(`${this.apiUrl}/PagarNomina`, pagoData);
  }

  getNominasPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/PagosPendientes`);
  }

  getHistorialPagos(nominaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/HistorialPagos/${nominaId}`);
  }
}

