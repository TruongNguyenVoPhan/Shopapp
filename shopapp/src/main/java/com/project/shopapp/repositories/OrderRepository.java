package com.project.shopapp.repositories;

import com.project.shopapp.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,  Long> {
    //Tim cac don hang cua 1 user nao do
    List<Order> findByUserId(Long userId);
}
