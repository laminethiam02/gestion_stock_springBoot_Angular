package com.example.gestion_stock.services.impl;


import com.example.gestion_stock.dtos.StockMovementDTO;
import com.example.gestion_stock.entities.Product;
import com.example.gestion_stock.entities.StockMovement;
import com.example.gestion_stock.repositories.ProductRepository;
import com.example.gestion_stock.repositories.StockMovementRepository;
import com.example.gestion_stock.services.StockMovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockMovementServiceImpl implements StockMovementService {

    @Autowired private StockMovementRepository movementRepository;
    @Autowired private ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getAllMovements() {
        return movementRepository.findAll().stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StockMovementDTO getMovementById(Long id) {
        StockMovement movement = movementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement non trouvé avec id : " + id));
        return convertToDTO(movement);
    }

    @Override
    public StockMovementDTO createMovement(StockMovementDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec id : " + dto.getProductId()));

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType(StockMovement.MovementType.valueOf(dto.getType()));
        movement.setQuantity(dto.getQuantity());
        movement.setReason(dto.getReason());

        // Mise à jour du stock
        if (movement.getType() == StockMovement.MovementType.ENTREE) {
            product.setQuantity(product.getQuantity() + movement.getQuantity());
        } else {
            if (product.getQuantity() < movement.getQuantity())
                throw new RuntimeException("Stock insuffisant. Stock actuel : " + product.getQuantity());
            product.setQuantity(product.getQuantity() - movement.getQuantity());
        }

        productRepository.save(product);
        StockMovement saved = movementRepository.save(movement);
        return convertToDTO(saved);
    }

    @Override
    public StockMovementDTO updateMovement(Long id, StockMovementDTO dto) {
        throw new UnsupportedOperationException("La modification d'un mouvement n'est pas autorisée.");
    }

    @Override
    public void deleteMovement(Long id) {
        StockMovement movement = movementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement non trouvé avec id : " + id));
        Product product = movement.getProduct();
        // Annuler l'effet sur le stock
        if (movement.getType() == StockMovement.MovementType.ENTREE) {
            product.setQuantity(product.getQuantity() - movement.getQuantity());
        } else {
            product.setQuantity(product.getQuantity() + movement.getQuantity());
        }
        productRepository.save(product);
        movementRepository.delete(movement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getMovementsByProduct(Long productId) {
        return movementRepository.findByProductId(productId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    private StockMovementDTO convertToDTO(StockMovement movement) {
        return new StockMovementDTO(
                movement.getId(),
                movement.getProduct().getId(),
                movement.getProduct().getName(),
                movement.getType().name(),
                movement.getQuantity(),
                movement.getReason(),
                movement.getMovementDate()
        );
    }
}
