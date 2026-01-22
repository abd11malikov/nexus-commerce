package com.otabek.nexus.repository;

import com.otabek.nexus.entity.Order;
import com.otabek.nexus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser(User user);
}
