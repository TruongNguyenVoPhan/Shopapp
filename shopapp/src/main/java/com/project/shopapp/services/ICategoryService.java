package com.project.shopapp.services;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.responses.CategoryCountResponse;

import java.util.List;

public interface ICategoryService {
    Category  createCategory(CategoryDTO category);

    Category getCategoryById(long id);

    List<Category> getAllCategory();

    Category updateCategory(long  categoryId, CategoryDTO categoryDTO);

    void deleteCategory(long id);

    List<CategoryCountResponse> getCategoriesWithCount();
}
