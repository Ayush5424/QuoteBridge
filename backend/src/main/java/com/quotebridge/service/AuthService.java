package com.quotebridge.service;

import com.quotebridge.config.JwtService;
import com.quotebridge.domain.entity.Organization;
import com.quotebridge.domain.entity.OrganizationMembership;
import com.quotebridge.domain.entity.Supplier;
import com.quotebridge.domain.entity.User;
import com.quotebridge.domain.enums.OrgType;
import com.quotebridge.domain.enums.Role;
import com.quotebridge.dto.auth.AuthRequest;
import com.quotebridge.dto.auth.AuthResponse;
import com.quotebridge.dto.auth.RegisterRequest;
import com.quotebridge.dto.auth.UserDto;
import com.quotebridge.exception.BadRequestException;
import com.quotebridge.exception.DuplicateResourceException;
import com.quotebridge.exception.UnauthorizedException;
import com.quotebridge.repository.OrganizationMembershipRepository;
import com.quotebridge.repository.OrganizationRepository;
import com.quotebridge.repository.SupplierRepository;
import com.quotebridge.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMembershipRepository membershipRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       OrganizationMembershipRepository membershipRepository,
                       SupplierRepository supplierRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.membershipRepository = membershipRepository;
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        List<OrganizationMembership> memberships = membershipRepository.findByUserId(user.getId());
        String orgId = memberships.isEmpty() ? null : memberships.get(0).getOrganization().getId();
        String orgName = memberships.isEmpty() ? null : memberships.get(0).getOrganization().getName();

        String token = jwtService.generateToken(user, orgId);

        UserDto userDto = new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                orgId,
                orgName
        );

        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email " + email + " already exists");
        }

        // 1. Create Organization
        String orgId = "org-" + UUID.randomUUID().toString().substring(0, 8);
        OrgType orgType = request.getRole() == Role.SUPPLIER ? OrgType.SUPPLIER : OrgType.BUYER;
        Organization org = new Organization(
                orgId,
                request.getOrganizationName().trim(),
                orgType,
                email,
                request.getContactPhone(),
                request.getAddress()
        );
        organizationRepository.save(org);

        // 2. Create User
        String userId = "user-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                userId,
                request.getFullName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );
        userRepository.save(user);

        // 3. Create Membership
        String memId = "mem-" + UUID.randomUUID().toString().substring(0, 8);
        OrganizationMembership membership = new OrganizationMembership(memId, org, user, "ADMIN");
        membershipRepository.save(membership);

        // 4. If supplier, create Supplier record
        if (request.getRole() == Role.SUPPLIER) {
            String supId = "sup-" + UUID.randomUUID().toString().substring(0, 8);
            Supplier supplier = new Supplier(
                    supId,
                    org,
                    "Verified Supplier",
                    request.getFullName(),
                    "Account Manager",
                    email,
                    request.getContactPhone()
            );
            supplierRepository.save(supplier);
        }

        String token = jwtService.generateToken(user, org.getId());
        UserDto userDto = new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                org.getId(),
                org.getName()
        );

        return new AuthResponse(token, userDto);
    }

    public User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
            return null;
        }
        return (User) auth.getPrincipal();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserProfile(User user) {
        if (user == null) {
            user = getCurrentAuthenticatedUser();
        }
        if (user == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        List<OrganizationMembership> memberships = membershipRepository.findByUserId(user.getId());
        String orgId = memberships.isEmpty() ? null : memberships.get(0).getOrganization().getId();
        String orgName = memberships.isEmpty() ? null : memberships.get(0).getOrganization().getName();
        return new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), orgId, orgName);
    }
}
