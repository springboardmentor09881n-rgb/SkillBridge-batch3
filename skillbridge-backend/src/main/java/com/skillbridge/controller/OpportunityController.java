package com.skillbridge.controller;

import com.skillbridge.model.Opportunity;
import com.skillbridge.model.User;
import com.skillbridge.repository.OpportunityRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Locale;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OpportunityController {
    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    // Create opportunity (NGO only)
    @PostMapping("/create/{ngoId}")
    public Opportunity createOpportunity(@RequestBody Opportunity opportunity,
            @PathVariable Long ngoId) {
        User ngo = userRepository.findById(ngoId).orElseThrow();
        opportunity.setNgo(ngo);
        return opportunityRepository.save(opportunity);
    }

    // Get all opportunities
    @GetMapping("/all")
    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

        // Get opportunities created by an NGO
        @GetMapping("/ngo/{ngoId}")
        public List<Opportunity> getNgoOpportunities(@PathVariable Long ngoId) {
        return opportunityRepository.findAll().stream()
            .filter(o -> o.getNgo() != null && Objects.equals(o.getNgo().getId(), ngoId))
            .toList();
        }

        // Filter opportunities with optional query params
        @GetMapping("/filter")
        public List<Opportunity> filterOpportunities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration) {

        String searchLower = search == null ? null : search.toLowerCase(Locale.ROOT);
        String skillLower = skill == null ? null : skill.toLowerCase(Locale.ROOT);
        String locationLower = location == null ? null : location.toLowerCase(Locale.ROOT);
        String durationLower = duration == null ? null : duration.toLowerCase(Locale.ROOT);

        return opportunityRepository.findAll().stream()
            .filter(o -> searchLower == null || searchLower.isBlank() ||
                containsIgnoreCase(o.getTitle(), searchLower) ||
                containsIgnoreCase(o.getDescription(), searchLower) ||
                containsIgnoreCase(o.getRequiredSkills(), searchLower) ||
                (o.getNgo() != null && containsIgnoreCase(o.getNgo().getFullName(), searchLower)))
            .filter(o -> skillLower == null || skillLower.isBlank() ||
                containsIgnoreCase(o.getRequiredSkills(), skillLower))
            .filter(o -> locationLower == null || locationLower.isBlank() ||
                containsIgnoreCase(o.getLocation(), locationLower))
            .filter(o -> durationLower == null || durationLower.isBlank() ||
                containsIgnoreCase(o.getDuration(), durationLower))
            .toList();
        }

    // Filter for skills
    @GetMapping("/filter/skill/{skill}")
    public List<Opportunity> filterBySkill(@PathVariable String skill) {
        return opportunityRepository.findByRequiredSkillsContainingIgnoreCase(skill);
    }

    //Filter for location
    @GetMapping("/filter/location/{location}")
    public List<Opportunity> filterByLocation(@PathVariable String location) {
        return opportunityRepository.findByLocationContainingIgnoreCase(location);
    }

    // Delete opportunity
    @DeleteMapping("/{id}")
    public void deleteOpportunity(@PathVariable Long id) {
        opportunityRepository.deleteById(id);
    }

    // Update opportunity
    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(
            @PathVariable Long id,
            @RequestBody Opportunity updates) {
        return opportunityRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updates.getTitle());
                    existing.setDescription(updates.getDescription());
                    existing.setRequiredSkills(updates.getRequiredSkills());
                    existing.setLocation(updates.getLocation());
                    existing.setDuration(updates.getDuration());
                    existing.setStatus(updates.getStatus());
                    return ResponseEntity.ok(opportunityRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean containsIgnoreCase(String value, String termLower) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(termLower);
    }
}
