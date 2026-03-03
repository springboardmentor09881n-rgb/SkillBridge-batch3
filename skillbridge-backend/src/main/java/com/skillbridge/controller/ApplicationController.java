package com.skillbridge.controller;

import com.skillbridge.model.*;
import com.skillbridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestParam Long volunteerId,
                                   @RequestParam Long opportunityId) {

        User volunteer = userRepository.findById(volunteerId).orElseThrow();
        Opportunity opportunity = opportunityRepository.findById(opportunityId).orElseThrow();

        if (!volunteer.getRole().equalsIgnoreCase("VOLUNTEER")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Only volunteers can apply"));
        }

        if (applicationRepository.existsByVolunteerIdAndOpportunityId(volunteerId, opportunityId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Already applied"));
        }

        Application application = new Application();
        application.setVolunteer(volunteer);
        application.setOpportunity(opportunity);

        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
    }

    @GetMapping("/opportunity/{id}")
    public List<Application> getApplications(@PathVariable Long id) {
        return applicationRepository.findByOpportunityId(id);
    }

    @PutMapping("/{id}")
    public Application updateStatus(@PathVariable Long id,
                                    @RequestParam String status) {

        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);

        return applicationRepository.save(app);
    }
}
