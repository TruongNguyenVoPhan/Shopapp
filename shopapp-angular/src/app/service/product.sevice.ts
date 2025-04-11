import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService{
    private apiGetProducts = `${environment.apiBaseUrl}products`;

    constructor(private http: HttpClient) { }
    getProducts( keywword: string,selectedCategoryId: number,
        page: number, limit: number): Observable<Product[]> {
            const params = new HttpParams()
                .set('keyword', keywword)
                .set('categoryId', selectedCategoryId.toString())
                .set('page', page.toString())
                .set('limit', limit.toString());
            return this.http.get<Product[]>(this.apiGetProducts, { params });
    }
    getDetailsProduct(productId: number): Observable<Product> {
        return this.http.get<Product>(`${environment.apiBaseUrl}products/${productId}`);
    }
    getProductById(productIds: number[]): Observable<Product[]> {
        debugger
        const params = new HttpParams().set('id', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
    }
    getProductByIds(productIds: number[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
    }
    deleteProduct(productId: number): Observable<any> {
        debugger
        return this.http.delete<any>(`${this.apiGetProducts}products/${productId}`);
    }
}