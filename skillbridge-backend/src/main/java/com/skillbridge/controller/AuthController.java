package com.skillbridge.controller;

import com.skillbridge.model.User;
import com.skillbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        // Check if user exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        // Save user directly
        User savedUser = userRepository.save(user);

        // Return user info
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());
        response.put("fullName", savedUser.getFullName());
        response.put("role", savedUser.getRole());
        response.put("message", "Signup successful");

        return ResponseEntity.ok(response);
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Find user by email
        User user = userRepository.findByEmail(email);

        // Check if user exists and password matches
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
        }

        // Return user info
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("message", "Login successful");

        return ResponseEntity.ok(response);
    }
}
