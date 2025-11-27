import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/Asistencias`;

  constructor(private http: HttpClient) {}


  getAsistencias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  getAsistenciasByUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

 
  registrarEntrada(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/entrada`, datos);
  }

  registrarSalida(asistenciaId: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/salida/${asistenciaId}`, datos);
  }

  
  actualizarAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asistencia);
  }

  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
    getHorariosByUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
