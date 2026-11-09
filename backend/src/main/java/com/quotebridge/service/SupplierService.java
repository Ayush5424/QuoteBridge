package com.quotebridge.service;

import com.quotebridge.domain.entity.Supplier;
import com.quotebridge.dto.supplier.SupplierDto;
import com.quotebridge.exception.ResourceNotFoundException;
import com.quotebridge.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierById(String id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
        return mapToDto(supplier);
    }

    private SupplierDto mapToDto(Supplier supplier) {
        return new SupplierDto(
                supplier.getId(),
                supplier.getOrganization() != null ? supplier.getOrganization().getName() : supplier.getContactName(),
                supplier.getSupplierTier(),
                supplier.getContactName(),
                supplier.getContactRole(),
                supplier.getContactEmail(),
                supplier.getContactPhone(),
                supplier.getStatus()
        );
    }
}
