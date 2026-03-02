package com.example.gestion_stock.services.impl;


import com.example.gestion_stock.dtos.ProductDTO;
import com.example.gestion_stock.entities.Category;
import com.example.gestion_stock.entities.Product;
import com.example.gestion_stock.entities.Supplier;
import com.example.gestion_stock.repositories.CategoryRepository;
import com.example.gestion_stock.repositories.ProductRepository;
import com.example.gestion_stock.repositories.SupplierRepository;
import com.example.gestion_stock.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec id : " + id));
        return convertToDTO(product);
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            product.setCategory(cat);
        }
        if (dto.getSupplierId() != null) {
            Supplier sup = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            product.setSupplier(sup);
        }

        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec id : " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        // Ne pas modifier quantity ici (gérée par mouvements)

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            product.setCategory(cat);
        } else {
            product.setCategory(null);
        }

        if (dto.getSupplierId() != null) {
            Supplier sup = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            product.setSupplier(sup);
        } else {
            product.setSupplier(null);
        }

        Product updated = productRepository.save(product);
        return convertToDTO(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id))
            throw new RuntimeException("Produit non trouvé avec id : " + id);
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsBySupplier(Long supplierId) {
        return productRepository.findBySupplierId(supplierId).stream()
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getSupplier() != null ? product.getSupplier().getId() : null,
                product.getSupplier() != null ? product.getSupplier().getName() : null
        );
    }
}
