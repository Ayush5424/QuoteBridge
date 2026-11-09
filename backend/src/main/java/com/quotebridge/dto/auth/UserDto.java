package com.quotebridge.dto.auth;

import com.quotebridge.domain.enums.Role;

public class UserDto {
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private String organizationId;
    private String organizationName;

    public UserDto() {}

    public UserDto(String id, String fullName, String email, Role role, String organizationId, String organizationName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.organizationId = organizationId;
        this.organizationName = organizationName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
}
