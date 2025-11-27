import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categorias} from '../shared/models/Categorias.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  // Cambia de http://localhost:4200 a http://localhost:5000 (puerto de tu backend .NET)
  private apiUrl = 'http://localhost:5135/api/Categorias';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categorias> {
    return this.http.get<Categorias>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categorias): Observable<Categorias> {
    return this.http.post<Categorias>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categorias): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
