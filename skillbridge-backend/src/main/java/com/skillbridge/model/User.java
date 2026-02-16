package com.skillbridge.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    // optional for both ngo and volunteer
    private String location;

    //For volunteer
    private String skills;
    private String bio;

    // For NGO
    private String organizationName;
    private String organizationDescription;
    private String websiteUrl;





    // Constructors
    public User() {}
    
    public User(Long id, String username, String email, String password, String fullName, String role, String location, String skills, String bio, String organizationName, String organizationDescription, String websiteUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.location = location;
        this.skills = skills;
        this.bio = bio;
        this.organizationName = organizationName;
        this.organizationDescription = organizationDescription;
        this.websiteUrl = websiteUrl;

    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getSkills() { return skills; }

    public void setSkills(String skills) { this.skills = skills; }

    public String getBio() { return bio; }

    public void setBio(String bio) { this.bio = bio; }

    public String getOrganizationName() { return organizationName; }

    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getOrganizationDescription() { return organizationDescription; }

    public void setOrganizationDescription(String organizationDescription) { this.organizationDescription = organizationDescription;  }

    public String getWebsiteUrl() { return websiteUrl; }

    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
}
