package com.otabek.nexus;


import com.otabek.nexus.dto.request.UserRequestDTO;
import com.otabek.nexus.dto.response.UserResponseDTO;
import com.otabek.nexus.entity.User;
import com.otabek.nexus.enums.Role;
import com.otabek.nexus.repository.UserRepository;
import com.otabek.nexus.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;


    @Test
    void createUser_successfully() {
        UserRequestDTO reqDto = UserRequestDTO.builder()
                .firstName("Otabek")
                .lastName("Abdumalikov")
                .phone("+998972850385")
                .email("otabek@abdumalikov.com")
                .username("abd11malikov")
                .password("otabek2006")
                .build();

        User savedUser = User.builder()
                .firstName("Otabek")
                .lastName("Abdumalikov")
                .phone("+998972850385")
                .email("otabek@abdumalikov.com")
                .username("abd11malikov")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        savedUser.setId(1L);

        UserResponseDTO expectedResponse = UserResponseDTO.builder()
                .id(1L)
                .firstName("Otabek")
                .lastName("Abdumalikov")
                .phone("+998972850385")
                .email("otabek@abdumalikov.com")
                .username("abd11malikov")
                .role(Role.CUSTOMER.name())
                .enabled(true)
                .build();

        when(passwordEncoder.encode(anyString())).thenReturn("encrypted-password-123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponseDTO result = userService.create(reqDto);

        assertThat(result)
                .isNotNull()
                .usingRecursiveComparison()
                .isEqualTo(expectedResponse);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();

        assertThat(capturedUser.getUsername()).isEqualTo(reqDto.getUsername());
        assertThat(capturedUser.getEmail()).isEqualTo(reqDto.getEmail());
        assertThat(capturedUser.getPassword()).isEqualTo("encrypted-password-123");
    }
}