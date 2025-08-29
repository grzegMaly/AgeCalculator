package com.ages.backend.repositories;

import com.ages.backend.model.AppRole;
import com.ages.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findRoleByRoleName(AppRole roleName);
}
