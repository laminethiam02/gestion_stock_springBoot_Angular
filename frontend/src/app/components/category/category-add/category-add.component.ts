import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CategoryService} from "../../../services/category.service";


@Component({
    selector: 'app-category-add',
    templateUrl: './category-add.component.html',
    styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent {
    form: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private service: CategoryService,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)]
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.service.createCategory(this.form.value).subscribe({
                next: () => this.router.navigate(['/categories']),
                error: () => { this.error = 'Erreur création'; this.loading = false; }
            });
        }
    }

    onCancel(): void { this.router.navigate(['/categories']); }
}
