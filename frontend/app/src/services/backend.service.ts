import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class BackendService {

  baseUrl: string = 'http://localhost:8000/api/'
  authUrl: string = `${this.baseUrl}`
  hospitalUrl: string = `${this.baseUrl}/hospital`

  constructor(private http: HttpClient) { }

  login(credentials: { username: string | null | undefined, password: string | null | undefined }): Observable<any> {
    return this.http.post(`${this.authUrl}token`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getHospitals(){
    return this.http.get(this.hospitalUrl);
  }

  getHospitalById(hospitalId: string){
    return this.http.get(`${this.hospitalUrl}/${hospitalId}`);
  }

  addHospital(hospitalData: object){
    return this.http.post(this.hospitalUrl, hospitalData);
  }

  updateHospital(hospitalId: string, hospitalData: object){
    return this.http.put(`${this.hospitalUrl}/${hospitalId}`, hospitalData);
  }
}
