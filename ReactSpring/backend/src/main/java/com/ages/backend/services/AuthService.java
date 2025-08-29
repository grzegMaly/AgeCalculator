package com.ages.backend.services;

import com.ages.backend.security.request.LoginRequest;
import com.ages.backend.security.response.LoginResponse;
import com.ages.backend.security.request.SignupRequest;
import com.ages.backend.response.ApiResponse;
import com.ages.backend.security.response.UserInfoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    ResponseEntity<ApiResponse<LoginResponse>> authenticate(LoginRequest loginRequest);

    ResponseEntity<ApiResponse<LoginResponse>> register(SignupRequest signupRequest);

    ApiResponse<UserInfoResponse> getDetails(UserDetails userDetails);
}
