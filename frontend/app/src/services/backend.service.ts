import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class BackendService {

  private baseUrl: string = 'http://localhost:8000/api/'
  private authUrl: string = `${this.baseUrl}`
  private hospitalUrl: string = `${this.baseUrl}hospital`
  private motherUrl: string = `${this.baseUrl}mother`
  private babyUrl: string = `${this.baseUrl}child`
  private batchUrl: string = `${this.baseUrl}batch`
  private userUrl: string = `${this.baseUrl}user`
  private currentUrl: string = `${this.baseUrl}current`
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  currentUserName: string = '';
  currentUserRole: string = '';


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

  setCurrentUser(){
    return this.getCurrentUser().pipe(
      tap((data: any) => {
        this.currentUserName = data.username;
        this.currentUserRole = data.role;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.currentUserName = '';
    this.currentUserRole = '';
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

  getCurrentUser(){
    return this.http.get(`${this.currentUrl}/user`, {
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

  getMothers(page: number, size: number){
    return this.http.get(`${this.motherUrl}?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getMotherById(id: string){
    return this.http.get(`${this.motherUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addMother(data: object){
    return this.http.post(this.motherUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateMother(id: string, data: object){
    return this.http.put(`${this.motherUrl}/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteMother(id: string){
    return this.http.delete(`${this.motherUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getBabies(page: number, size: number){
    return this.http.get(`${this.babyUrl}?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getBabyById(id: string){
    return this.http.get(`${this.babyUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addBaby(data: object){
    return this.http.post(this.babyUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateBaby(id: string, data: object){
    return this.http.put(`${this.babyUrl}/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteBaby(id: string){
    return this.http.delete(`${this.babyUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getBatches(page: number, size: number){
    return this.http.get(`${this.batchUrl}?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getBatchById(id: string){
    return this.http.get(`${this.batchUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addBatch(data: object){
    return this.http.post(this.batchUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateBatch(id: string, data: object){
    return this.http.put(`${this.batchUrl}/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteBatch(id: string){
    return this.http.delete(`${this.batchUrl}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getDonations(motherId: string, page: number, size: number){
    return this.http.get(`${this.motherUrl}/${motherId}/donation?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getDonationById(motherId: string, id: string){
    return this.http.get(`${this.motherUrl}/${motherId}/donation/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addDonation(motherId: string, data: object){
    return this.http.post(`${this.motherUrl}/${motherId}/donation`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateDonation(motherId: string, id: string, data: object){
    return this.http.put(`${this.motherUrl}/${motherId}/donation/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteDonation(motherId: string, id: string){
    return this.http.delete(`${this.motherUrl}/${motherId}/donation/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getCollections(batchId: string, page: number, size: number){
    return this.http.get(`${this.batchUrl}/${batchId}/collection?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getCollectionById(batchId: string, id: string){
    return this.http.get(`${this.batchUrl}/${batchId}/collection/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addCollection(batchId: string, data: object){
    return this.http.post(`${this.batchUrl}/${batchId}/collection`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateCollection(batchId: string, id: string, data: object){
    return this.http.put(`${this.batchUrl}/${batchId}/collection/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteCollection(batchId: string, id: string){
    return this.http.delete(`${this.batchUrl}/${batchId}/collection/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getDispatches(babyId: string, page: number, size: number){
    return this.http.get(`${this.babyUrl}/${babyId}/dispatch?page=${page}&page_size=${size}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getDispatchById(babyId: string, id: string){
    return this.http.get(`${this.babyUrl}/${babyId}/dispatch/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addDispatch(babyId: string, data: object){
    return this.http.post(`${this.babyUrl}/${babyId}/dispatch`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateDispatch(babyId: string, id: string, data: object){
    return this.http.put(`${this.babyUrl}/${babyId}/dispatch/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteDispatch(babyId: string, id: string){
    return this.http.delete(`${this.babyUrl}/${babyId}/dispatch/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
