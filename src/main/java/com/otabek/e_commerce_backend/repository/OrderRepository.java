package com.otabek.e_commerce_backend.repository;

import com.otabek.e_commerce_backend.entity.Order;
import com.otabek.e_commerce_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser(User user);
}
