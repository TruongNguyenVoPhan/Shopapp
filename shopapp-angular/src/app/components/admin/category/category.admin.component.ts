import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/categories';
import { CategoryService } from '../../../service/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: ['./category.admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoryAdminComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories(0, 100);
  }

  getCategories(page: number, limit: number): void {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  insertCategory() {
    this.router.navigate(['/admin/categories/insert']);
  }

  updateCategory(categoryId: number) {
    this.router.navigate(['/admin/categories/update', categoryId]);
  }

  deleteCategory(category: Category) {
    const confirmation = confirm('Are you sure you want to delete this category?');

    if (confirmation) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          alert('Xóa thành công');
          this.getCategories(0, 100);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}