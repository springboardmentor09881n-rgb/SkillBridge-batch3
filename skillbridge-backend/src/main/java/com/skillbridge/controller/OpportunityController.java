package com.skillbridge.controller;

import com.skillbridge.model.Opportunity;
import com.skillbridge.model.User;
import com.skillbridge.repository.OpportunityRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    // Delete opportunity
    @DeleteMapping("/{id}")
    public void deleteOpportunity(@PathVariable Long id) {
        opportunityRepository.deleteById(id);
    }
}
