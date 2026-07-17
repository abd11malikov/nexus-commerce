package com.otabek.nexus.service;

import com.otabek.nexus.dto.request.RegisterRequest;
import com.otabek.nexus.dto.request.UserRequestDTO;
import com.otabek.nexus.dto.response.UserResponseDTO;
import com.otabek.nexus.entity.User;
import com.otabek.nexus.enums.Role;
import com.otabek.nexus.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO create(UserRequestDTO requestDTO){
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(requestDTO.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByPhone(requestDTO.getPhone())) {
            throw new IllegalArgumentException("Phone number already taken");
        }
        User user = mapToEntity(requestDTO);
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    /**
     * Simplified self-service sign-up: name + email + password (twice).
     * The email doubles as the login username; phone is left blank.
     */
    @Transactional
    public UserResponseDTO register(RegisterRequest req) {
        if (req.getPassword() == null || !req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        String email = req.getEmail() == null ? null : req.getEmail().trim().toLowerCase();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String[] name = splitName(req.getName());
        User user = User.builder()
                .username(email)                 // email is the login identity
                .email(email)
                .firstName(name[0])
                .lastName(name[1])
                .phone(null)
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        return mapToResponse(userRepository.save(user));
    }

    /**
     * Resolves a login identifier that may be either a username (e.g. seeded
     * accounts) or an email (accounts from the new sign-up / Google flows).
     */
    public UserResponseDTO getByUsernameOrEmail(String login) {
        String value = login == null ? "" : login.trim();
        User user = userRepository.findByUsername(value)
                .or(() -> userRepository.findByEmail(value.toLowerCase()))
                .orElseThrow(() -> new EntityNotFoundException("No account found for: " + login));
        return mapToResponse(user);
    }

    /**
     * Looks up (or lazily provisions) a local account for a verified Google user.
     * Google accounts have no local password, so a random one is stored.
     */
    @Transactional
    public UserResponseDTO findOrCreateGoogleUser(String rawEmail, String name) {
        String email = rawEmail == null ? null : rawEmail.trim().toLowerCase();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google account did not provide an email");
        }
        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findByUsername(email))
                .orElse(null);
        if (user == null) {
            String[] parts = splitName(name);
            user = User.builder()
                    .username(email)
                    .email(email)
                    .firstName(parts[0])
                    .lastName(parts[1])
                    .phone(null)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.CUSTOMER)
                    .enabled(true)
                    .build();
            user = userRepository.save(user);
        }
        return mapToResponse(user);
    }

    /** Splits a full name into [firstName, lastName]; lastName may be null. */
    private String[] splitName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return new String[]{"User", null};
        }
        String trimmed = fullName.trim().replaceAll("\\s+", " ");
        int space = trimmed.indexOf(' ');
        if (space < 0) {
            return new String[]{trimmed, null};
        }
        return new String[]{trimmed.substring(0, space), trimmed.substring(space + 1)};
    }

    @Transactional
    public UserResponseDTO update(Long id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        user.setFirstName(requestDTO.getFirstName());
        user.setLastName(requestDTO.getLastName());
        user.setPhone(requestDTO.getPhone());
        if (!user.getEmail().equals(requestDTO.getEmail())) {
            if(userRepository.existsByEmail(requestDTO.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(requestDTO.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public UserResponseDTO getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    public List<UserResponseDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }


    public User mapToEntity(UserRequestDTO requestDTO){
        return User.builder()
                .username(requestDTO.getUsername())
                .firstName(requestDTO.getFirstName())
                .lastName(requestDTO.getLastName())
                .phone(requestDTO.getPhone())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(requestDTO.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
    }

    public UserResponseDTO mapToResponse(User user){
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .build();
    }

    public UserResponseDTO getUserByUsername(String username){
        return mapToResponse(
                userRepository.findByUsername(username).orElseThrow(()-> new EntityNotFoundException("User not found by this username: "+username))
        );
    }

    public void promoteToAdmin(long id){
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found by this id: " + id));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .roles(user.getRole().name())
                .password(user.getPassword())
                .build();
    }
}