import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-insert-category-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss']
})
export class InsertCategoryAdminComponent {

  name: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  saveCategory() {
    if (!this.name.trim()) {
      alert('Vui lòng nhập tên category');
      return;
    }

    const categoryDTO = {
      name: this.name
    };

    this.categoryService.insertCategory(categoryDTO).subscribe({
      next: (response: any) => {
        alert('Thêm category thành công');
        this.router.navigate(['/admin/categories']);
      },
      error: (error: any) => {
        console.error(error);
        alert('Lỗi thêm category');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
  }
}