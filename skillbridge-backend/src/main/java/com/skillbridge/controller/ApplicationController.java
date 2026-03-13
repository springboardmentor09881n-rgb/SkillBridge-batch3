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

    public static class ApplyRequest {
        private Long volunteerId;
        private Long opportunityId;
        private String motivation;
        private String availability;
        private String contactNote;

        public Long getVolunteerId() {
            return volunteerId;
        }

        public void setVolunteerId(Long volunteerId) {
            this.volunteerId = volunteerId;
        }

        public Long getOpportunityId() {
            return opportunityId;
        }

        public void setOpportunityId(Long opportunityId) {
            this.opportunityId = opportunityId;
        }

        public String getMotivation() {
            return motivation;
        }

        public void setMotivation(String motivation) {
            this.motivation = motivation;
        }

        public String getAvailability() {
            return availability;
        }

        public void setAvailability(String availability) {
            this.availability = availability;
        }

        public String getContactNote() {
            return contactNote;
        }

        public void setContactNote(String contactNote) {
            this.contactNote = contactNote;
        }
    }

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OpportunityRepository opportunityRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyFromParams(@RequestParam Long volunteerId,
                                             @RequestParam Long opportunityId) {
        return createApplication(volunteerId, opportunityId, null, null, null);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> applyWithForm(@RequestBody ApplyRequest request) {
        if (request.getVolunteerId() == null || request.getOpportunityId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "volunteerId and opportunityId are required"));
        }
        return createApplication(
                request.getVolunteerId(),
                request.getOpportunityId(),
                request.getMotivation(),
                request.getAvailability(),
                request.getContactNote());
    }

    @GetMapping("/opportunity/{id}")
    public List<Application> getApplications(@PathVariable Long id) {
        return applicationRepository.findByOpportunityId(id);
    }

    @GetMapping("/volunteer/{id}")
    public List<Application> getVolunteerApplications(@PathVariable Long id) {
        return applicationRepository.findByVolunteerId(id);
    }

    @PutMapping("/{id}")
    public Application updateStatus(@PathVariable Long id,
                                    @RequestParam String status) {

        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);

        return applicationRepository.save(app);
    }

    private ResponseEntity<?> createApplication(Long volunteerId,
                                                Long opportunityId,
                                                String motivation,
                                                String availability,
                                                String contactNote) {
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
        application.setMotivation(motivation);
        application.setAvailability(availability);
        application.setContactNote(contactNote);

        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
    }
}
