package com.project.shopapp.services;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService{
    private final CategoryRepository categoryRepository;
    @Override
    public Category createCategory(CategoryDTO categoryDTO) {

        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new RuntimeException("Category already exists");
        }

        Category newCategory = Category.builder()
                .name(categoryDTO.getName())
                .active(true)
                .build();

        return categoryRepository.save(newCategory);
    }

    @Override
    public Category getCategoryById(long id) {
        return categoryRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Category not found"));
    }

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findByActiveTrue();
    }

    @Override
    public Category updateCategory(long categoryId, CategoryDTO categoryDTO) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName((categoryDTO.getName()));
        categoryRepository.save(existingCategory);
        return existingCategory;
    }

    @Override
    public void deleteCategory(long id) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setActive(false);
        categoryRepository.save(existingCategory);
    }
}
