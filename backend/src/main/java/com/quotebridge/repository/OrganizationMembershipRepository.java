package com.quotebridge.repository;

import com.quotebridge.domain.entity.OrganizationMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationMembershipRepository extends JpaRepository<OrganizationMembership, String> {
    List<OrganizationMembership> findByUserId(String userId);
    List<OrganizationMembership> findByOrganizationId(String organizationId);
    Optional<OrganizationMembership> findByOrganizationIdAndUserId(String organizationId, String userId);
}
