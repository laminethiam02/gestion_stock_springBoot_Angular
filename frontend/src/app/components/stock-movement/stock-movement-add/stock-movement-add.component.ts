import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Product} from "../../../models/product.model";
import {StockMovementService} from "../../../services/stock-movement.service";
import {ProductService} from "../../../services/product.service";


@Component({
    selector: 'app-stock-movement-add',
    templateUrl: './stock-movement-add.component.html',
    styleUrls: ['./stock-movement-add.component.css']
})
export class StockMovementAddComponent implements OnInit {
    form: FormGroup;
    products: Product[] = [];
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private movementService: StockMovementService,
        private productService: ProductService,
        private router: Router
    ) {
        this.form = this.fb.group({
            productId: ['', Validators.required],
            type: ['ENTREE', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            reason: ['']
        });
    }

    ngOnInit(): void {
        this.productService.getAllProducts().subscribe(data => this.products = data);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.movementService.createMovement(this.form.value).subscribe({
                next: () => this.router.navigate(['/stock-movements']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void { this.router.navigate(['/stock-movements']); }
}
