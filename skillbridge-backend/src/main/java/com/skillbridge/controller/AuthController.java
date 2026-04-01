package com.skillbridge.controller;

import com.skillbridge.model.User;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;

        public AuthController(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.authenticationManager = authenticationManager;
                this.jwtService = jwtService;
        }

        // Signup endpoint
        @PostMapping("/signup")
        public ResponseEntity<?> signup(@RequestBody User user) {

                if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("message", "Email already exists"));
                }

                // Encode password before saving
                user.setPassword(passwordEncoder.encode(user.getPassword()));

                User savedUser = userRepository.save(user);

                Map<String, Object> userData = new java.util.HashMap<>();
                userData.put("id", savedUser.getId());
                userData.put("username", savedUser.getUsername());
                userData.put("email", savedUser.getEmail());
                userData.put("role", savedUser.getRole());
                userData.put("fullName", savedUser.getFullName());
                userData.put("skills", savedUser.getSkills());
                userData.put("location", savedUser.getLocation());

                return ResponseEntity.ok(Map.of(
                                "message", "Signup successful",
                                "user", userData));
        }

        // Login endpoint
        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.get("email"),
                                                request.get("password")));

                User user = userRepository.findByEmail(request.get("email"))
                                .orElseThrow();

                String token = jwtService.generateToken(user.getEmail());

                Map<String, Object> userData = new java.util.HashMap<>();
                userData.put("id", user.getId());
                userData.put("username", user.getUsername());
                userData.put("email", user.getEmail());
                userData.put("role", user.getRole());
                userData.put("fullName", user.getFullName());
                userData.put("skills", user.getSkills());
                userData.put("location", user.getLocation());

                return ResponseEntity.ok(Map.of(
                                "message", "Login successful",
                                "token", token,
                                "user", userData));
        }
}
