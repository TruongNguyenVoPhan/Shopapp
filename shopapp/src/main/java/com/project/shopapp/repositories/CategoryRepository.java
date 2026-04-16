package com.project.shopapp.repositories;

import com.project.shopapp.models.Category;
import com.project.shopapp.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);

    List<Category> findByActiveTrue();

    @Query("""
    SELECT c.id as id,
        c.name as name,
        COUNT(p.id) as productCount
    FROM Category c
    LEFT JOIN Product p ON p.category.id = c.id AND p.active = true
    WHERE c.active = true
    GROUP BY c.id, c.name
    """)
    List<Object[]> getCategoriesWithCount();
}
