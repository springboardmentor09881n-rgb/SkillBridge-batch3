package com.skillbridge.service;

import com.skillbridge.model.Opportunity;
import com.skillbridge.model.User;
import com.skillbridge.repository.OpportunityRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    public static class MatchResult {
        private Opportunity opportunity;
        private int matchScore;
        private int matchPercentage;
        private List<String> matchedSkills;
        private boolean locationMatch;

        public Opportunity getOpportunity() { return opportunity; }
        public void setOpportunity(Opportunity opportunity) { this.opportunity = opportunity; }
        public int getMatchScore() { return matchScore; }
        public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
        public int getMatchPercentage() { return matchPercentage; }
        public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }
        public List<String> getMatchedSkills() { return matchedSkills; }
        public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
        public boolean isLocationMatch() { return locationMatch; }
        public void setLocationMatch(boolean locationMatch) { this.locationMatch = locationMatch; }
    }

    public List<MatchResult> getMatchesForVolunteer(Long volunteerId) {
        User volunteer = userRepository.findById(volunteerId).orElse(null);
        if (volunteer == null) return Collections.emptyList();

        Set<String> volunteerSkills = parseSkills(volunteer.getSkills());
        String volunteerLocation = normalize(volunteer.getLocation());

        if (volunteerSkills.isEmpty() && volunteerLocation.isEmpty()) {
            return Collections.emptyList();
        }

        List<Opportunity> openOpportunities = opportunityRepository.findAll().stream()
                .filter(o -> "OPEN".equalsIgnoreCase(o.getStatus()))
                .toList();

        List<MatchResult> results = new ArrayList<>();

        for (Opportunity opp : openOpportunities) {
            Set<String> requiredSkills = parseSkills(opp.getRequiredSkills());
            String oppLocation = normalize(opp.getLocation());

            // Calculate skill overlap
            List<String> matched = volunteerSkills.stream()
                    .filter(vs -> requiredSkills.stream().anyMatch(rs -> rs.equals(vs)))
                    .collect(Collectors.toList());

            boolean locationMatch = !volunteerLocation.isEmpty() && !oppLocation.isEmpty()
                    && (oppLocation.contains(volunteerLocation) || volunteerLocation.contains(oppLocation));

            int skillScore = matched.size() * 20;  // each matched skill = 20 points
            int locationScore = locationMatch ? 25 : 0;
            int totalScore = skillScore + locationScore;

            if (totalScore <= 0) continue;

            // Calculate percentage based on max possible score
            int maxPossible = requiredSkills.size() * 20 + 25;
            int percentage = Math.min(100, (int) Math.round((double) totalScore / maxPossible * 100));

            MatchResult result = new MatchResult();
            result.setOpportunity(opp);
            result.setMatchScore(totalScore);
            result.setMatchPercentage(percentage);
            result.setMatchedSkills(matched);
            result.setLocationMatch(locationMatch);
            results.add(result);
        }

        // Sort by score descending
        results.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return results.stream().limit(10).toList();
    }

    private Set<String> parseSkills(String skills) {
        if (skills == null || skills.isBlank()) return Collections.emptySet();
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .map(s -> s.toLowerCase(Locale.ROOT))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private String normalize(String value) {
        if (value == null) return "";
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
