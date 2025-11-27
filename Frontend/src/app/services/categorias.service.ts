import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categorias} from '../shared/models/Categorias.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  // Cambia de http://localhost:5135 a http://localhost:5135 (puerto de tu backend .NET)
  private apiUrl = 'http://localhost:5135/api/Categorias';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categorias[]> {
    console.log('🔍 GET Categorías');
    return this.http.get<Categorias[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categorias> {
    console.log(`🔍 GET Categoría ID: ${id}`);
    return this.http.get<Categorias>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categorias): Observable<Categorias> {
    console.log('📝 POST Categoría:', categoria);
    return this.http.post<Categorias>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categorias): Observable<any> {
    console.log(`📝 PUT Categoría ID: ${id}`, categoria);
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    console.log(`🗑️ DELETE Categoría ID: ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
