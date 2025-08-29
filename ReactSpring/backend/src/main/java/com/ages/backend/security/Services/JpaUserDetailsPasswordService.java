package com.ages.backend.security.Services;

import com.ages.backend.model.User;
import com.ages.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsPasswordService implements UserDetailsPasswordService {

    private final UserRepository userRepository;

    @Override
    public UserDetails updatePassword(UserDetails userDetails, String newPassword) {

        User user = ((UserDetailsImpl) userDetails).getUser();
        user.setPassword(newPassword);
        userRepository.save(user);
        return new UserDetailsImpl(user);
    }
}
