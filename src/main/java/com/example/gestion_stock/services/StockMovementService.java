package com.example.gestion_stock.services;


import com.example.gestion_stock.dtos.StockMovementDTO;

import java.util.List;

public interface StockMovementService {
    List<StockMovementDTO> getAllMovements();
    StockMovementDTO getMovementById(Long id);
    StockMovementDTO createMovement(StockMovementDTO movementDTO);
    StockMovementDTO updateMovement(Long id, StockMovementDTO movementDTO);
    void deleteMovement(Long id);
    List<StockMovementDTO> getMovementsByProduct(Long productId);
}
