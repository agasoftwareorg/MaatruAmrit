import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class BackendService {

  baseUrl: string = 'http://localhost:8000/api/'
  authUrl: string = `${this.baseUrl}`
  hospitalUrl: string = `${this.baseUrl}hospital`
  userUrl: string = `${this.baseUrl}user`
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());


  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  login(credentials: { username: string | null | undefined, password: string | null | undefined }): Observable<any> {
    return this.http.post(`${this.authUrl}token`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
  }

  getHospitals(page: number, size: number){
    return this.http.get(`${this.hospitalUrl}?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getHospitalById(hospitalId: string){
    return this.http.get(`${this.hospitalUrl}/${hospitalId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addHospital(hospitalData: object){
    return this.http.post(this.hospitalUrl, hospitalData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateHospital(hospitalId: string, hospitalData: object){
    return this.http.put(`${this.hospitalUrl}/${hospitalId}`, hospitalData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteHospital(hospitalId: string){
    return this.http.delete(`${this.hospitalUrl}/${hospitalId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getUsers(hospitalId: string | null, page: number=1, size: number=50){
    return this.http.get(`${this.userUrl}?hospital=${hospitalId}&page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getUserById(userId: string){
    return this.http.get(`${this.userUrl}/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addUser(data: object){
    return this.http.post(this.userUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateUser(userId: string, data: object){
    return this.http.put(`${this.userUrl}/${userId}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteUser(userId: string){
    return this.http.delete(`${this.userUrl}/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
