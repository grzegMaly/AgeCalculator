package com.ages.backend.services;

import com.ages.backend.model.AppRole;
import com.ages.backend.model.Role;
import com.ages.backend.model.User;
import com.ages.backend.repositories.RoleRepository;
import com.ages.backend.repositories.UserRepository;
import com.ages.backend.security.request.LoginRequest;
import com.ages.backend.security.response.LoginResponse;
import com.ages.backend.security.request.SignupRequest;
import com.ages.backend.response.ApiResponse;
import com.ages.backend.security.Services.UserDetailsImpl;
import com.ages.backend.security.jwt.JwtUtils;
import com.ages.backend.security.response.UserInfoResponse;
import com.ages.backend.utils.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final EmailSender emailSender;

    @Value("${spring.mail.greeting_text}")
    private String GREETING_TEXT;

    @Override
    public ResponseEntity<ApiResponse<LoginResponse>> authenticate(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return sendAuthResponse(userDetails, "Logged in successfully", "success");
    }

    @Override
    public ResponseEntity<ApiResponse<LoginResponse>> register(SignupRequest signupRequest) {

        if (userRepository.existsUserByEmail(signupRequest.getEmail())) {
            return null;
        }

        if (userRepository.existsUserByName(signupRequest.getName())) {
            return null;
        }

        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User user = new User(
                signupRequest.getName(),
                signupRequest.getEmail(),
                encodedPassword
        );

        Role role = roleRepository.findRoleByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        emailSender.sendGreetingsMail(savedUser.getEmail(), GREETING_TEXT);

        UserDetailsImpl savedUserDetailsImpl = new UserDetailsImpl(savedUser);
        return sendAuthResponse(savedUserDetailsImpl, "Registered Successfully", "success");
    }

    @Override
    public ApiResponse<UserInfoResponse> getDetails(UserDetails userDetails) {

        User user = ((UserDetailsImpl) userDetails).getUser();
        Set<String> authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        UserInfoResponse body = UserInfoResponse.build(user, authorities);
        return new ApiResponse<>("OK", "success", body);
    }

    private ResponseEntity<ApiResponse<LoginResponse>> sendAuthResponse(UserDetailsImpl userDetails, String message, String status) {

        User user = userDetails.getUser();
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String jwtToken = jwtUtils.generateTokenFromId(user.getId());
        ResponseCookie cookie = jwtUtils.generateCookie(jwtToken);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());

        LoginResponse response = new LoginResponse(user.getId(), user.getName(), jwtToken, roles);
        return new ResponseEntity<>(
                new ApiResponse<>(message, status, response),
                headers,
                HttpStatus.OK);
    }
}
