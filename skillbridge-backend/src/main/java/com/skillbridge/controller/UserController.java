package com.skillbridge.controller;

import com.skillbridge.model.User;
import com.skillbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update user profile
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        return userRepository.findById(id).map(user -> {
            if (updates.containsKey("fullName"))
                user.setFullName(updates.get("fullName"));
            if (updates.containsKey("username"))
                user.setUsername(updates.get("username"));
            if (updates.containsKey("skills"))
                user.setSkills(updates.get("skills"));
            if (updates.containsKey("location"))
                user.setLocation(updates.get("location"));

            User saved = userRepository.save(user);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", saved.getId());
            userData.put("username", saved.getUsername());
            userData.put("email", saved.getEmail());
            userData.put("role", saved.getRole());
            userData.put("fullName", saved.getFullName());
            userData.put("skills", saved.getSkills());
            userData.put("location", saved.getLocation());

            return ResponseEntity.ok(userData);
        }).orElse(ResponseEntity.notFound().build());
    }
}
