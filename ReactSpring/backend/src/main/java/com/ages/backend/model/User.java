package com.ages.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(unique = true, nullable = false,  length = 50, name = "name")
    private String name;

    @Column(unique = true, nullable = false, length = 50, name = "email")
    private String email;

    @Column(nullable = false, length = 120, name = "password")
    private String password;

    @Column(nullable = false, name = "account_non_locked")
    private boolean accountNonLocked = true;

    @Column(nullable = false, name = "account_non_expired")
    private boolean accountNonExpired = true;

    @Column(nullable = false, name = "credentials_non_expired")
    private boolean credentialsNonExpired = true;

    @Column(nullable = false, name = "enabled")
    private boolean enabled = true;

    @Column(nullable = false, name = "credential_expiry_date")
    private LocalDate credentialsExpiryDate;

    @Column(nullable = false, name = "account_expiry_date")
    private LocalDate accountExpiryDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name= "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinColumn(name = "role_id", referencedColumnName = "role_id", nullable = false)
    @JsonManagedReference
    @ToString.Exclude
    private Role role;

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    @PrePersist
    void prePersist() {
        if (this.credentialsExpiryDate == null) {
            this.credentialsExpiryDate = LocalDate.now().plusYears(1);
        }

        if (accountExpiryDate == null) {
            this.accountExpiryDate = LocalDate.now().plusYears(1);
        }
    }
}

