import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Category} from "../../../models/category.model";
import {Supplier} from "../../../models/supplier.model";
import {ProductService} from "../../../services/product.service";
import {CategoryService} from "../../../services/category.service";
import {SupplierService} from "../../../services/supplier.service";


@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
    form: FormGroup;
    categories: Category[] = [];
    suppliers: Supplier[] = [];
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private supplierService: SupplierService,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            price: ['', [Validators.required, Validators.min(0.01)]],
            quantity: [0, [Validators.required, Validators.min(0)]],
            categoryId: [''],
            supplierId: ['']
        });
    }

    ngOnInit(): void {
        this.categoryService.getAllCategories().subscribe(data => this.categories = data);
        this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.productService.createProduct(this.form.value).subscribe({
                next: () => this.router.navigate(['/products']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur création';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void { this.router.navigate(['/products']); }
}
