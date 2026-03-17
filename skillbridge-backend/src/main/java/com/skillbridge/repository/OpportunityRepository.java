package com.skillbridge.repository;

import com.skillbridge.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByRequiredSkillsContainingIgnoreCase(String skill);

    List<Opportunity> findByLocationContainingIgnoreCase(String location);
}