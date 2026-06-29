package com.project.shopapp.repositories;

import com.project.shopapp.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdAndStatus(Long userId, String status);

    @Query("SELECT o FROM Order o JOIN o.user u WHERE " +
            "o.active = true AND (" +
            ":keyword IS NULL OR :keyword = '' OR " +
            "LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.note) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ") ORDER BY o.orderDate DESC")
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.product " +
           "WHERE o.user.id = :userId AND o.active = true " +
           "ORDER BY o.orderDate DESC")
    List<Order> findByUserIdWithDetails(@Param("userId") Long userId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.product " +
           "WHERE o.user.id = :userId AND o.status = :status AND o.active = true " +
           "ORDER BY o.orderDate DESC")
    List<Order> findByUserIdAndStatusWithDetails(
            @Param("userId") Long userId,
            @Param("status") String status
    );
}