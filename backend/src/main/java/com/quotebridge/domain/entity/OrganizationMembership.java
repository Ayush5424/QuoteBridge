package com.quotebridge.domain.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "organization_memberships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_id", "user_id"})
})
public class OrganizationMembership {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String roleInOrg = "MEMBER";

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public OrganizationMembership() {}

    public OrganizationMembership(String id, Organization organization, User user, String roleInOrg) {
        this.id = id;
        this.organization = organization;
        this.user = user;
        this.roleInOrg = roleInOrg;
        this.createdAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRoleInOrg() { return roleInOrg; }
    public void setRoleInOrg(String roleInOrg) { this.roleInOrg = roleInOrg; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
