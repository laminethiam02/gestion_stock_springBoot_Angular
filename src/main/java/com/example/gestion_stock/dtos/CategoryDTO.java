package com.example.gestion_stock.dtos;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    public CategoryDTO() {}
    public CategoryDTO(Long id, String name, String description) {
        this.id = id; this.name = name; this.description = description;
    }

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
