package com.project.shopapp.repositories;

import com.project.shopapp.models.Order;
import com.project.shopapp.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,  Long> {
    //Tim cac don hang cua 1 user nao do
    List<Order> findByUserId(Long userId);
    @Query("SELECT o FROM Order o JOIN o.user u WHERE " +
            "o.active = true AND (" +
            ":keyword IS NULL OR :keyword = '' OR " +
            "LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.note) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.email) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ") ORDER BY o.orderDate DESC")
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);





    // Thêm phương thức tìm theo vnpTxnRef
//    Optional<Order> findByVnpTxnRef(String vnpTxnRef);
}
