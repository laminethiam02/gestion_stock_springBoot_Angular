import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Product} from "../../../models/product.model";
import {ProductService} from "../../../services/product.service";


@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    loading = false;
    error = '';
    searchTerm = '';

    constructor(
        private productService: ProductService,
        private router: Router
    ) {}

    ngOnInit(): void { this.loadProducts(); }

    loadProducts(): void {
        this.loading = true;
        this.productService.getAllProducts().subscribe({
            next: (data) => { this.products = data; this.loading = false; },
            error: () => { this.error = 'Erreur'; this.loading = false; }
        });
    }

    onSearch(): void {
        if (this.searchTerm.trim()) {
            this.products = this.products.filter(p =>
                p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (p.categoryName && p.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                (p.supplierName && p.supplierName.toLowerCase().includes(this.searchTerm.toLowerCase()))
            );
        } else { this.loadProducts(); }
    }

    onAdd(): void { this.router.navigate(['/products/add']); }
    onEdit(id: number): void { this.router.navigate(['/products/edit', id]); }
    onDelete(id: number): void {
        if (confirm('Supprimer ce produit ?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => this.products = this.products.filter(p => p.id !== id),
                error: () => this.error = 'Erreur suppression'
            });
        }
    }
}
