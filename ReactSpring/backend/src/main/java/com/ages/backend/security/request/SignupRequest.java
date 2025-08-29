package com.ages.backend.security.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank
    @Size(min = 5)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 12)
    private String password;

    @NotBlank
    @Size(min = 12)
    private String passwordConfirm;
}
