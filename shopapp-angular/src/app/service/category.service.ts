import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Category } from '../models/categories';

@Injectable({
  providedIn: 'root'
})

export class CategoryService{
    private apiGetCategories = `${environment.apiBaseUrl}categories`;

  constructor(private http: HttpClient) { }

  getCategories(page: number, limit: number): Observable<Category[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Category[]>(this.apiGetCategories, { params });
  }
  
  insertCategory(data: any): Observable<any> {
    return this.http.post(this.apiGetCategories, data);
  }

  deleteCategory(categoryId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiGetCategories}/${categoryId}`);
  }
}