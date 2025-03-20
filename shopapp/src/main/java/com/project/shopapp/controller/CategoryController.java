package com.project.shopapp.controller;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.responses.CategoryResponse;
import com.project.shopapp.responses.UpdateCategoryResponse;
import com.project.shopapp.services.CategoryService;
import com.project.shopapp.ultils.MessageKeys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;
import java.util.Locale;


@RestController
@RequestMapping("${api.prefix}/categories")
//@Validated
//Dependency Injection
@RequiredArgsConstructor
public class CategoryController  {
    private final CategoryService categoryService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")
    //Neu tham so truyen vao la 1 object thi sao ? => Data Tranfer Object = Request Object
    public ResponseEntity<?> createCategory(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result){
        CategoryResponse categoryResponse = new CategoryResponse();
        if (result.hasErrors()){
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            categoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.CREATE_CATEGORY_FAILED));
            categoryResponse.setErrors(errorMessages);
            return ResponseEntity.badRequest().body(categoryDTO);
        }
        Category category= categoryService.createCategory(categoryDTO);
        categoryResponse.setCategory(category);
        return ResponseEntity.ok(categoryResponse);
    }
    //Hien thi tat ca cac categories
    @GetMapping("")//http://localhost:8088/api/v1/categories?page=1&limit=10
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ){
        List<Category> categories = categoryService.getAllCategory();
        return ResponseEntity.ok(categories);
    }
    @PutMapping("/{id}")
    public ResponseEntity<UpdateCategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO
    ) {
        UpdateCategoryResponse updateCategoryResponse = new UpdateCategoryResponse();
        categoryService.updateCategory(id,categoryDTO);
        updateCategoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.UPDATED_CATEGORY_SUCCESSFULLY,id));
        return ResponseEntity.ok(updateCategoryResponse);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(localizationUtils.getLocalizedMessage(MessageKeys.DELETED_CATEGORY_SUCCESSFULLY));
    }
}

