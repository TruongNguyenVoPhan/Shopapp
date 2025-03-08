package com.project.shopapp.repositories;

import com.project.shopapp.models.Category;
import com.project.shopapp.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
