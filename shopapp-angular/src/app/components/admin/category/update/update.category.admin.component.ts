import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-update-category-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss']
})
export class UpdateCategoryAdminComponent implements OnInit {

  categoryId: number = 0;
  categoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (categories: any[]) => {
        const found = categories.find(c => c.id === this.categoryId);
        if (found) {
          this.categoryName = found.name;
        }
      },
      error: (err) => {
        console.error('Lỗi load category:', err);
        alert('Không tìm thấy category');
        this.router.navigate(['/admin/categories']);
      }
    });
  }

  saveCategory(): void {
    if (!this.categoryName.trim()) {
      alert('Vui lòng nhập tên category');
      return;
    }

    this.categoryService.updateCategory(this.categoryId, { name: this.categoryName }).subscribe({
      next: () => {
        alert('Cập nhật thành công');
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error(err);
        alert('Lỗi cập nhật category');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}