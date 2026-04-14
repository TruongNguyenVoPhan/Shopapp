package com.project.shopapp.repositories;

import com.project.shopapp.models.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByNameIgnoreCase(String name);

    Page<Product> findByActiveTrue(Pageable pageable);

    List<Product> findByActiveTrue();

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
        AND (:categoryId IS NULL OR :categoryId = 0 OR p.category.id = :categoryId)
        AND (
            :keyword IS NULL OR :keyword = ''
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<Product> searchProducts(
        @Param("categoryId") Long categoryId,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.productImages
        WHERE p.id = :productId
        AND p.active = true
    """)
    Optional<Product> getDetailProduct(@Param("productId") Long productId);

    @Query("SELECT p FROM Product p WHERE p.id IN :productIds")
    List<Product> findProductByIds(@Param("productIds") List<Long> productIds);
}