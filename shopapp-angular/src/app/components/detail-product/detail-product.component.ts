import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { FormsModule, } from '@angular/forms';
import { ProductService } from '../../service/product.sevice';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environment/environment';
import { ProductImage } from '../../models/product.image';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  standalone: true,
  styleUrl: './detail-product.component.scss',
  imports: [HeaderComponent, FooterComponent,FormsModule,CommonModule]
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1; //Số lượng sản phẩm
  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    // private categoryService: CategoryService, 
    // private route: ActivatedRoute
  ) {

  }
  ngOnInit() {
    debugger
    const idParam = 14
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailsProduct(this.productId).subscribe({
        next: (response: any) => {            
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image:ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}products/images/${product_image.image_url}`;
            });
          }            
          debugger
          this.product = response 
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger
        },
        error: (error: any) => console.error('Error fetching detail:', error)
      });
    }else {
      console.error('Invalid product ID:', idParam);
    }
  }
  showImage(index: number) : void {
    debugger
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      //Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0 ) {
        index = 0;
      }else if (index > this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      //Gán index hiện tại
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number)  {
    debugger
    //Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; //cập nhật currentImageIndex
  }
  nextImage() {
    //Gọi khi bấm nút next
    this.showImage(this.currentImageIndex + 1); //hiện ảnh tiếp theo
  }
  previousImage() {
    //Gọi khi bấm nút previous
    this.showImage(this.currentImageIndex - 1); //hiện ảnh trước đó
  }
  addToCart() {
    if (this.product) {
      debugger
      //Thêm sản phẩm vào giỏ hàng
      this.cartService.addToCart(this.product.id, this.quantity);
    }else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  buyNow() {
    debugger
    // Nhấn nút mua ngay, điều hướng đến trang checkout
    this.router.navigate(['orders']);
  }

}
