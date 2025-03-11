import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  private userName = new BehaviorSubject<string>('');
  private userRole = new BehaviorSubject<string>('');
  private hospitalName = new BehaviorSubject<string>('');
  private hospitalHasAnalyzer = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserName(): Observable<string> {
    return this.userName.asObservable();
  }

  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(userRole => userRole === 'ADMIN')
    )
  }

  isHospitalAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(userRole => userRole === 'HOSPITAL_ADMIN')
    )
  }

  isHospitalUser(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(userRole => userRole === 'HOSPITAL_USER')
    )
  }

  getHospitalName(): Observable<string> {
    return this.hospitalName.asObservable();
  }

  hasAnalyzer(): Observable<boolean> {
    return this.hospitalHasAnalyzer.asObservable();
  }


  login(credentials: { username: string | null | undefined, password: string | null | undefined }): Observable<any> {
    return this.http.post(`${this.authUrl}token`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
        this.isAuthenticated.next(true);
      }),
      concatMap(() => this.setCurrentHospital()),
      concatMap(() => this.setCurrentUser()),
    );
  }

  setCurrentUser(){
    return this.getCurrentUser().pipe(
      tap((data: any) => {
        this.userName.next(data.username);
        this.userRole.next(data.role);
      })
    );
  }

  setCurrentHospital(){
    return this.getCurrentHospital().pipe(
      tap((data: any) => {
        this.hospitalHasAnalyzer.next(data.is_analyzer)
        this.hospitalName.next(data.name)
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    // this.userName.next('');
    // this.userRole.next('');
    // this.hospitalHasAnalyzer.next(false);
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
    hospitalData = this.convertToFormData(hospitalData)
    return this.http.post(this.hospitalUrl, hospitalData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateHospital(hospitalId: string, hospitalData: object){
    hospitalData = this.convertToFormData(hospitalData)
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

  getCurrentHospital(){
    return this.http.get(`${this.currentUrl}/hospital`, {
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

  getLatestMotherID(){
    return this.http.get(`${this.motherUrl}/id`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  convertToFormData(payload: any): FormData {
    const formData = new FormData();
    
    Object.keys(payload).forEach((key) => {
      if (payload[key] instanceof File) {
        // If the value is a file, append it directly
        formData.append(key, payload[key]);
      } else if (Array.isArray(payload[key])) {
        // If the value is an array, append each element individually
        payload[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        // Otherwise, convert to string and append
        formData.append(key, payload[key]?.toString() || "");
      }
    });
  
    return formData;
  }

  addMother(data: object){
    data = this.convertToFormData(data)
    return this.http.post(this.motherUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateMother(id: string, data: object){
    data = this.convertToFormData(data)
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

  getLatestBabyID(){
    return this.http.get(`${this.babyUrl}/id`, {
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

  getPureBatches(page: number, size: number){
    return this.http.get(`${this.batchUrl}?page=${page}&page_size=${size}&pasteurization=NEGATIVE`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getLatestBatch(){
    return this.http.get(`${this.batchUrl}/id`, {
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
    data = this.convertToFormData(data)
    return this.http.post(this.batchUrl, data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updateBatch(id: string, data: object){
    data = this.convertToFormData(data)
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
