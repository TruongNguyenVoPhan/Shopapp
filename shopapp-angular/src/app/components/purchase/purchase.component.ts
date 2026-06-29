import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  orders: any[] = [];
  userId: number = 0;
  activeTab: string = 'all';
  loading: boolean = false;

  readonly statusLabels: Record<string, string> = {
    pending:    'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped:    'Đang giao',
    delivered:  'Hoàn thành',
    cancelled:  'Đã huỷ',
  };

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUserFromSession();
    if (user) {
      this.userId = user.id;
    }
    this.loadOrders('all');
  }

  selectTab(status: string): void {
    this.activeTab = status;
    this.loadOrders(status);
  }

  loadOrders(status: string): void {
    this.loading = true;

    const call$ = status === 'all'
      ? this.orderService.getOrdersByUser(this.userId)
      : this.orderService.getOrdersByStatus(this.userId, status);

    call$.subscribe({
      next: (response: any[]) => {
        this.orders = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  buildImageUrl(thumbnail: string | null): string {
    if (!thumbnail) return 'assets/images/no-image.png';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `${environment.apiBaseUrl}products/images/${thumbnail}`;
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  formatMoney(amount: number): string {
    if (!amount) return '0 ₫';
    return amount.toLocaleString('vi-VN') + ' ₫';
  }
}