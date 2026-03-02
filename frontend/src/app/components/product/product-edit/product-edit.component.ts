import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Category} from "../../../models/category.model";
import {Supplier} from "../../../models/supplier.model";
import {ProductService} from "../../../services/product.service";
import {CategoryService} from "../../../services/category.service";
import {SupplierService} from "../../../services/supplier.service";

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
    form: FormGroup;
    categories: Category[] = [];
    suppliers: Supplier[] = [];
    loading = false;
    error = '';
    id!: number;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private supplierService: SupplierService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            price: ['', [Validators.required, Validators.min(0.01)]],
            quantity: [{ value: 0, disabled: true }], // Quantité non modifiable directement
            categoryId: [''],
            supplierId: ['']
        });
    }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id')!;
        this.loading = true;
        this.productService.getProductById(this.id).subscribe({
            next: (data) => {
                this.form.patchValue({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    quantity: data.quantity,
                    categoryId: data.categoryId,
                    supplierId: data.supplierId
                });
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement du produit';
                this.loading = false;
            }
        });

        this.categoryService.getAllCategories().subscribe(data => this.categories = data);
        this.supplierService.getAllSuppliers().subscribe(data => this.suppliers = data);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            // Récupérer la valeur du formulaire (quantity est désactivé, donc non envoyé)
            const productData = { ...this.form.value, quantity: undefined };
            this.productService.updateProduct(this.id, productData).subscribe({
                next: () => this.router.navigate(['/products']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la modification';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/products']);
    }
}
