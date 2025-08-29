package com.ages.backend.repositories;

import com.ages.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Modifying
    @Query("update User u set u.password = :password where u.email = :email")
    void updatePasswordByEmail(String password, String email);

    boolean existsUserByEmail(String email);

    boolean existsUserByName(String name);
}
