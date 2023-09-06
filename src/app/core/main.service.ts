import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './interface';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  key = '4312ce2adce849d0ab6dab5ac54ce8c0';
  base__url = `https://crudcrud.com/api/${this.key}`;

  constructor(private http: HttpClient) {}

  addUser(data: User): Observable<User> {
    return this.http.post<User>(`${this.base__url}/users`, data);
  }

  EditUser(payload:any): Observable<User> {
    return this.http.put<User>(`${this.base__url}/users/${payload.id}`, payload.data);
  }

  deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.base__url}/users/${id}`);
  }

  getData(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base__url}/users`);
  }
}
