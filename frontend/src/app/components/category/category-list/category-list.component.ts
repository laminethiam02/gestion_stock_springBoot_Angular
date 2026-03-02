import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Category} from "../../../models/category.model";
import {CategoryService} from "../../../services/category.service";


@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];
    loading = false;
    error = '';
    searchTerm = '';

    constructor(
        private categoryService: CategoryService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.loading = true;
        this.categoryService.getAllCategories().subscribe({
            next: (data) => { this.categories = data; this.loading = false; },
            error: () => { this.error = 'Erreur de chargement'; this.loading = false; }
        });
    }

    onSearch(): void {
        if (this.searchTerm.trim()) {
            this.categories = this.categories.filter(c =>
                c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (c.description && c.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
            );
        } else {
            this.loadCategories();
        }
    }

    onAdd(): void { this.router.navigate(['/categories/add']); }
    onEdit(id: number): void { this.router.navigate(['/categories/edit', id]); }
    onDelete(id: number): void {
        if (confirm('Supprimer cette catégorie ?')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => this.categories = this.categories.filter(c => c.id !== id),
                error: () => this.error = 'Erreur suppression'
            });
        }
    }
}
