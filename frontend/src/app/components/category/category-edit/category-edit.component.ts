import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CategoryService} from "../../../services/category.service";


@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
    form: FormGroup;
    loading = false;
    error = '';
    id!: number;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)]
        });
    }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id')!;
        this.loading = true;
        this.categoryService.getCategoryById(this.id).subscribe({
            next: (data) => {
                this.form.patchValue(data);
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement de la catégorie';
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.loading = true;
            this.categoryService.updateCategory(this.id, this.form.value).subscribe({
                next: () => this.router.navigate(['/categories']),
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la modification';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/categories']);
    }
}
