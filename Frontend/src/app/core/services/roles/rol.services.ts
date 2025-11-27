import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl = "http://localhost:5135/api/Roles";
    constructor(private http: HttpClient) {}

    getRol(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }   
    getRoleById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }                       
    createRole(role: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, role);
    }
    updateRole(id: number, role: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, role);
    }
    deleteRole(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}   