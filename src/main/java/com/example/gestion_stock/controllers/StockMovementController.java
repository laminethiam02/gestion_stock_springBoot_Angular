package com.example.gestion_stock.controllers;


import com.example.gestion_stock.dtos.StockMovementDTO;
import com.example.gestion_stock.services.StockMovementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin(origins = "http://localhost:4200")
public class StockMovementController {

    @Autowired private StockMovementService movementService;

    @GetMapping
    public ResponseEntity<List<StockMovementDTO>> getAllMovements() {
        return ResponseEntity.ok(movementService.getAllMovements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMovementDTO> getMovementById(@PathVariable Long id) {
        return ResponseEntity.ok(movementService.getMovementById(id));
    }

    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<StockMovementDTO>> getMovementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(movementService.getMovementsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<StockMovementDTO> createMovement(@Valid @RequestBody StockMovementDTO dto) {
        StockMovementDTO created = movementService.createMovement(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockMovementDTO> updateMovement(@PathVariable Long id, @Valid @RequestBody StockMovementDTO dto) {
        StockMovementDTO updated = movementService.updateMovement(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovement(@PathVariable Long id) {
        movementService.deleteMovement(id);
        return ResponseEntity.noContent().build();
    }
}
