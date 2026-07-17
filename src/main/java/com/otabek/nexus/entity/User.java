package com.otabek.nexus.entity;

import com.otabek.nexus.enums.Role;
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

    // Phone is optional now — simplified registration (name/email/password) no longer collects it.
    // Kept unique so it can still be enforced when a value is present (NULLs are allowed multiple times).
    @Column(unique = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Email is the login identity for accounts created via the simplified/Google flows.
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean enabled = true;

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    private List<Order> orders;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;
}
