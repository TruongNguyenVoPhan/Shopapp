import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.sevice';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
  imports: [FooterComponent, HeaderComponent, CommonModule]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(private router: Router, 
      private productService: ProductService) { }
  ngOnInit() {
    this.getProducts(this.currentPage, this.itemsPerPage);
  }

  getProducts(page: number, limit: number) {
    this.productService.getProducts(page, limit)
    .subscribe({
      next: (response: any) => {
        debugger
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}products/images/${product.thumbnail}`;
        });
        this.products = response.products; 
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => console.error('Error fetching products:', error)
    });
  }
  
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const visiblePages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts(this.currentPage, this.itemsPerPage);
  }
  onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }  
}
