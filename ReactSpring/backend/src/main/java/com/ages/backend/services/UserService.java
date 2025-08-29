package com.ages.backend.services;

import com.ages.backend.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);

    User registerUser(User user);
}
