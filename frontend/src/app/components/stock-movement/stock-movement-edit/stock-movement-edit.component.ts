import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StockMovementService } from '../../../services/stock-movement.service';
import { StockMovement } from '../../../models/stock-movement.model';

@Component({
    selector: 'app-stock-movement-edit',
    templateUrl: './stock-movement-edit.component.html',
    styleUrls: ['./stock-movement-edit.component.css']
})
export class StockMovementEditComponent implements OnInit {
    movementForm!: FormGroup;
    loading = true;
    submitting = false;
    error: string | null = null;
    movementId!: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private movementService: StockMovementService
    ) {}

    ngOnInit(): void {
        this.movementId = +this.route.snapshot.paramMap.get('id')!;
        this.loadMovement();
    }

    private loadMovement(): void {
        this.movementService.getMovementById(this.movementId).subscribe({
            next: (movement: StockMovement) => {
                this.initForm(movement);
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Impossible de charger le mouvement.';
                this.loading = false;
            }
        });
    }

    private initForm(movement: StockMovement): void {
        // Formater la date pour l'input de type date (YYYY-MM-DD)
        let movementDateStr = '';
        if (movement.movementDate) {
            const date = new Date(movement.movementDate);
            movementDateStr = date.toISOString().split('T')[0];
        }

        this.movementForm = this.fb.group({
            productId: [movement.productId, Validators.required],
            quantity: [movement.quantity, [Validators.required, Validators.min(1)]],
            type: [movement.type, Validators.required],
            movementDate: [movementDateStr, Validators.required],
            reason: [movement.reason]
        });
    }

    onSubmit(): void {
        if (this.movementForm.invalid) return;

        this.submitting = true;
        this.error = null;

        const formValue = this.movementForm.value;
        const updatedMovement = new StockMovement({
            id: this.movementId,
            productId: formValue.productId,
            quantity: formValue.quantity,
            type: formValue.type,
            movementDate: new Date(formValue.movementDate), // Reconversion en Date
            reason: formValue.reason
        });

        this.movementService.updateMovement(this.movementId, updatedMovement).subscribe({
            next: () => {
                this.router.navigate(['/stock-movements']);
            },
            error: (err) => {
                this.error = 'Erreur lors de la mise à jour.';
                this.submitting = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/stock-movements']);
    }
}
