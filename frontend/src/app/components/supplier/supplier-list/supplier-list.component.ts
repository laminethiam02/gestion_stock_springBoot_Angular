import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Supplier} from "../../../models/supplier.model";
import {SupplierService} from "../../../services/supplier.service";


@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
    suppliers: Supplier[] = [];
    loading = false;
    error = '';
    searchTerm = '';

    constructor(
        private supplierService: SupplierService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadSuppliers();
    }

    loadSuppliers(): void {
        this.loading = true;
        this.supplierService.getAllSuppliers().subscribe({
            next: (data) => {
                this.suppliers = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Erreur lors du chargement des fournisseurs';
                this.loading = false;
            }
        });
    }

    onSearch(): void {
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            this.suppliers = this.suppliers.filter(s =>
                s.name.toLowerCase().includes(term) ||
                (s.email && s.email.toLowerCase().includes(term)) ||
                (s.phone && s.phone.toLowerCase().includes(term)) ||
                (s.address && s.address.toLowerCase().includes(term))
            );
        } else {
            this.loadSuppliers();
        }
    }

    onAdd(): void {
        this.router.navigate(['/suppliers/add']);
    }

    onEdit(id: number): void {
        this.router.navigate(['/suppliers/edit', id]);
    }

    onDelete(id: number): void {
        if (confirm('Supprimer ce fournisseur ?')) {
            this.supplierService.deleteSupplier(id).subscribe({
                next: () => {
                    this.suppliers = this.suppliers.filter(s => s.id !== id);
                },
                error: () => {
                    this.error = 'Erreur lors de la suppression';
                }
            });
        }
    }
}
