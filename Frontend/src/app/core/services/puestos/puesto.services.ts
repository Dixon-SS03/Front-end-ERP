import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root", 
})
export class PuestoService {
    private apiUrl = "http://localhost:5135/api/Puestos";
    constructor(private http: HttpClient) {}

    getPuesto(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
    getPuestoById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }   
    createPuesto(puesto: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, puesto);
    }
    updatePuesto(id: number, puesto: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, puesto);
    }
    deletePuesto(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
