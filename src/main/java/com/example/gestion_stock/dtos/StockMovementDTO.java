package com.example.gestion_stock.dtos;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class StockMovementDTO {
    private Long id;

    @NotNull
    private Long productId;
    private String productName;

    @NotNull
    private String type; // "ENTREE" ou "SORTIE"

    @NotNull @Min(1)
    private Integer quantity;

    private String reason;
    private LocalDateTime movementDate;

    public StockMovementDTO() {}
    public StockMovementDTO(Long id, Long productId, String productName, String type,
                            Integer quantity, String reason, LocalDateTime movementDate) {
        this.id = id; this.productId = productId; this.productName = productName; this.type = type;
        this.quantity = quantity; this.reason = reason; this.movementDate = movementDate;
    }

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDateTime getMovementDate() { return movementDate; }
    public void setMovementDate(LocalDateTime movementDate) { this.movementDate = movementDate; }
}
