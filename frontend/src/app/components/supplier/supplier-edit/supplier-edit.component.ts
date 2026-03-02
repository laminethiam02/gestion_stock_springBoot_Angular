import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SupplierService} from "../../../services/supplier.service";


@Component({
    selector: 'app-supplier-edit',
    templateUrl: './supplier-edit.component.html',
    styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {
    form: FormGroup;
    loading = false;
    error = '';
    id!: number;

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(150)]],
            email: ['', [Validators.email, Validators.maxLength(150)]],
            phone: ['', Validators.maxLength(50)],
            address: ['', Validators.maxLength(500)]
        });
    }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id')!;
        this.loading = true;
        this.supplierService.getSupplierById(this.id).subscribe({
            next: (data) => {
                this.form.patchValue(data);
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement du fournisseur';
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.supplierService.updateSupplier(this.id, this.form.value).subscribe({
                next: () => this.router.navigate(['/suppliers']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la modification';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/suppliers']);
    }
}
