import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Product } from '../models/product';
import { ProductImage } from '../models/product.image';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService{
    private apiBaseUrl = environment.apiBaseUrl;
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
    updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<Product> {
        return this.http.put<Product>(`${this.apiBaseUrl}products/${productId}`, updatedProduct);
    }     
    insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
        // Add a new product
        return this.http.post(`${this.apiBaseUrl}products`, insertProductDTO);
    }
    uploadImages(productId: number, files: File[]): Observable<any> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post(`${this.apiBaseUrl}products/uploads/${productId}`, formData);
    }
        deleteProductImage(id: number): Observable<any> {
        debugger
        return this.http.delete<string>(`${this.apiBaseUrl}product_images/${id}`);
    }
}