package com.skillbridge.repository;
import com.skillbridge.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OpportunityRepository  extends JpaRepository<Opportunity, Long> {
}
