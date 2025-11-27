import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private apiUrl = 'http://localhost:5135/api/Horarios';

  constructor(private http: HttpClient) {}


  getHorariosByUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  asignarHorarios(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignar`, dto);
  }


  eliminarHorario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
