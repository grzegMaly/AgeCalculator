package com.ages.backend.security.response;

import com.ages.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private UUID id;
    private String username;
    private Set<String> roles;

    public static UserInfoResponse build(User user, Set<String> authorities) {
        return new UserInfoResponse(
                user.getId(),
                user.getName(),
                authorities
        );
    }
}
