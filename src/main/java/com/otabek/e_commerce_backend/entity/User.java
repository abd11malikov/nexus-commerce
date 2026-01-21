package com.otabek.e_commerce_backend.entity;

import com.otabek.e_commerce_backend.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity{

    @Column(unique = true,nullable = false)
    private String username;

    private String firstName;

    private String lastName;

    @Column(nullable = false,unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String email;

    @Column(nullable = false)
    private String password;

    private boolean enabled = true;

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    private List<Order> orders;
}
