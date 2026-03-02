package com.example.gestion_stock.dtos;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierDTO {
    private Long id;

    @NotBlank @Size(max = 150)
    private String name;

    @Email @Size(max = 150)
    private String email;

    @Size(max = 50)
    private String phone;

    @Size(max = 500)
    private String address;

    public SupplierDTO() {}
    public SupplierDTO(Long id, String name, String email, String phone, String address) {
        this.id = id; this.name = name; this.email = email; this.phone = phone; this.address = address;
    }

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
