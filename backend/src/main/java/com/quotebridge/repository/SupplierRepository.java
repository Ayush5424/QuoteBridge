package com.quotebridge.repository;

import com.quotebridge.domain.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    Optional<Supplier> findByOrganizationId(String organizationId);
    Optional<Supplier> findByContactName(String contactName);
}
