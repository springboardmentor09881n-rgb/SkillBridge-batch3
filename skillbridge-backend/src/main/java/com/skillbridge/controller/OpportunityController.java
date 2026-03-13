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
@CrossOrigin("*")
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

    // Get opportunities by NGO id
    @GetMapping("/ngo/{ngoId}")
    public List<Opportunity> getByNgo(@PathVariable Long ngoId) {
        return opportunityRepository.findAll().stream()
                .filter(o -> o.getNgo() != null && o.getNgo().getId().equals(ngoId))
                .toList();
    }

        // Filter/search opportunities for volunteers
        @GetMapping("/filter")
        public List<Opportunity> filterOpportunities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration) {

        String searchLower = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String skillLower = skill == null ? "" : skill.trim().toLowerCase(Locale.ROOT);
        String locationLower = location == null ? "" : location.trim().toLowerCase(Locale.ROOT);
        String durationLower = duration == null ? "" : duration.trim().toLowerCase(Locale.ROOT);

        return opportunityRepository.findAll().stream()
            .filter(o -> o.getStatus() == null || !"CLOSED".equalsIgnoreCase(o.getStatus()))
            .filter(o -> searchLower.isBlank() ||
                containsIgnoreCase(o.getTitle(), searchLower) ||
                containsIgnoreCase(o.getDescription(), searchLower) ||
                containsIgnoreCase(o.getRequiredSkills(), searchLower) ||
                containsIgnoreCase(o.getLocation(), searchLower) ||
                (o.getNgo() != null && containsIgnoreCase(o.getNgo().getFullName(), searchLower)))
            .filter(o -> skillLower.isBlank() || containsIgnoreCase(o.getRequiredSkills(), skillLower))
            .filter(o -> locationLower.isBlank() || containsIgnoreCase(o.getLocation(), locationLower))
            .filter(o -> durationLower.isBlank() || containsIgnoreCase(o.getDuration(), durationLower))
            .toList();
        }

    // Edit opportunity
    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id,
            @RequestBody Opportunity updates) {
        return opportunityRepository.findById(id).map(opp -> {
            if (updates.getTitle() != null)
                opp.setTitle(updates.getTitle());
            if (updates.getDescription() != null)
                opp.setDescription(updates.getDescription());
            if (updates.getRequiredSkills() != null)
                opp.setRequiredSkills(updates.getRequiredSkills());
            if (updates.getLocation() != null)
                opp.setLocation(updates.getLocation());
            if (updates.getDuration() != null)
                opp.setDuration(updates.getDuration());
            if (updates.getStatus() != null)
                opp.setStatus(updates.getStatus());
            return ResponseEntity.ok(opportunityRepository.save(opp));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete opportunity
    @DeleteMapping("/{id}")
    public void deleteOpportunity(@PathVariable Long id) {
        opportunityRepository.deleteById(id);
    }

    private boolean containsIgnoreCase(String value, String termLower) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(termLower);
    }
}
