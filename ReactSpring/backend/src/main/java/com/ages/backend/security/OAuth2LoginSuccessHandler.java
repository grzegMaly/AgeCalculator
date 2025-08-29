package com.ages.backend.security;

import com.ages.backend.model.AppRole;
import com.ages.backend.model.Role;
import com.ages.backend.model.User;
import com.ages.backend.repositories.RoleRepository;
import com.ages.backend.security.Services.UserDetailsImpl;
import com.ages.backend.security.jwt.JwtUtils;
import com.ages.backend.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtils jwtUtils;

    @Value("${frontend.url}")
    private String frontendUrl;

    private static final String PROVIDER_GITHUB = "github";
    private static final String PROVIDER_GOOGLE = "google";
    private static final Set<String> ALLOWED_PROVIDERS = Set.of(PROVIDER_GITHUB, PROVIDER_GOOGLE);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {

        OAuth2AuthenticationToken oAuth2AuthToken = (OAuth2AuthenticationToken) authentication;
        String provider = oAuth2AuthToken.getAuthorizedClientRegistrationId();

        if (!ALLOWED_PROVIDERS.contains(provider)) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }

        DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = principal.getAttributes();

        String idAttributeKey;
        String email = asString(attributes.get("email"));
        String username;
        switch (provider) {
            case PROVIDER_GITHUB -> {
                username = asString(attributes.get("login"));
                idAttributeKey = "id";
            }
            case PROVIDER_GOOGLE -> {
                username = email != null ? email.split("@")[0] : asString(attributes.get("name"));
                idAttributeKey = "sub";
            }
            default -> {
                username = "";
                idAttributeKey = "id";
            }
        }

        User currentUser = userService.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    Role role = roleRepository.findRoleByRoleName(AppRole.ROLE_USER)
                            .orElseThrow(() -> new IllegalStateException("Default role not found"));
                    user.setRole(role);
                    user.setEmail(email);
                    user.setName(username);
                    return userService.registerUser(user);
                });

        setUpOAuth2ContextHolder(currentUser, attributes, oAuth2AuthToken, idAttributeKey);

        Set<SimpleGrantedAuthority> authorities = principal.getAuthorities().stream()
                .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                .collect(Collectors.toSet());
        authorities.add(new SimpleGrantedAuthority(currentUser.getRole().getRoleName().name()));

        String jwtToken = jwtUtils.generateTokenFromId(currentUser.getId());
        ResponseCookie cookie = jwtUtils.generateCookie(jwtToken);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String targetUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", jwtToken)
                .build()
                .toUriString();

        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl(targetUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }

    private String asString(Object val) {
        return val == null ? null : val.toString();
    }

    private void setUpOAuth2ContextHolder(User user,
                                          Map<String, Object> attributes,
                                          OAuth2AuthenticationToken oAuth2AuthToken,
                                          String idAttributeKey) {
        List<SimpleGrantedAuthority> roleAuth =
                List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name()));

        DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                roleAuth,
                attributes,
                idAttributeKey
        );

        Authentication authentication = new OAuth2AuthenticationToken(
                oAuth2User,
                roleAuth,
                oAuth2AuthToken.getAuthorizedClientRegistrationId()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
