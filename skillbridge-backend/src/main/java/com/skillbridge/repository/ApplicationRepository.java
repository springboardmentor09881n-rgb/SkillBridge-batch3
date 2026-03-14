package com.skillbridge.repository;
import com.skillbridge.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ApplicationRepository extends JpaRepository<Application, Long>{

    boolean existsByVolunteerIdAndOpportunityId(Long volunteerId, Long opportunityId);

    List<Application> findByOpportunityId(Long opportunityId);

    List<Application> findByVolunteerId(Long volunteerId);

    List<Application> findByOpportunityNgoId(Long ngoId);
}

