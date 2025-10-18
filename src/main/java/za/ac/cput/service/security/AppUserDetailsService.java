package za.ac.cput.service.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Admin;
import za.ac.cput.domain.User;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.UserRepository;

import java.util.Collection;
import java.util.List;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public AppUserDetailsService(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String normalizedUsername = username == null ? null : username.trim().toLowerCase();

        if (normalizedUsername == null || normalizedUsername.isEmpty()) {
            throw new UsernameNotFoundException("Email cannot be empty");
        }

        Admin admin = adminRepository.findByEmail(normalizedUsername);
        if (admin != null) {
            return buildUserDetails(admin.getEmail(), admin.getPassword(), admin.getRole());
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
    }

    private UserDetails buildUserDetails(String email, String password, String role) {
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
        return org.springframework.security.core.userdetails.User
                .withUsername(email)
                .password(password)
                .authorities(authorities)
                .accountLocked(false)
                .accountExpired(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}