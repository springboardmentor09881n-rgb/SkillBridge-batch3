package com.skillbridge.controller;

import com.skillbridge.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/volunteer/{id}")
    public List<MatchingService.MatchResult> getMatches(@PathVariable Long id) {
        return matchingService.getMatchesForVolunteer(id);
    }
}
