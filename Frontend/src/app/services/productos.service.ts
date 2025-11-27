import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Producto } from "../shared/models/Producto.model";
import { Categorias } from "../shared/models/Categorias.model";

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  private apiUrl = "http://localhost:5135/api/Productos";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategoriaProducto(id: number): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(`${this.apiUrl}/categoria/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProducto(producto: Producto): Observable<Producto> {
    console.log("Enviando a API:", this.apiUrl);
    console.log("Datos:", producto);

    return this.http.post<Producto>(this.apiUrl, producto, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error("Error en el servicio:", error);

    if (error.error instanceof ErrorEvent) {
      console.error("Error del cliente:", error.error.message);
    } else {
      console.error(
        `Backend retornó código ${error.status}, ` +
        `body era: ${JSON.stringify(error.error)}`
      );
    }

    return throwError(() => error);
  }
}

