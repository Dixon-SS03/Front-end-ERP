import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DatosEmpleadoService {
    private apiUrl = "http://localhost:5135/api/DatosEmpleados";
    constructor(private http: HttpClient) {}

    getDatosEmpleados(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getDatosEmpleadoById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    createDatosEmpleado(datosEmpleado: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, datosEmpleado);
    }
    updateDatosEmpleado(id: number, datosEmpleado: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, datosEmpleado);
    }
    deleteDatosEmpleado(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }   
}