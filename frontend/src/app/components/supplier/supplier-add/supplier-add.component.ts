import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SupplierService} from "../../../services/supplier.service";


@Component({
    selector: 'app-supplier-add',
    templateUrl: './supplier-add.component.html',
    styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent {
    form: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(150)]],
            email: ['', [Validators.email, Validators.maxLength(150)]],
            phone: ['', Validators.maxLength(50)],
            address: ['', Validators.maxLength(500)]
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.supplierService.createSupplier(this.form.value).subscribe({
                next: () => this.router.navigate(['/suppliers']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la création';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/suppliers']);
    }
}
