import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockMovement } from '../../../models/stock-movement.model';
import { StockMovementService } from '../../../services/stock-movement.service';

@Component({
    selector: 'app-stock-movement-list',
    templateUrl: './stock-movement-list.component.html',
    styleUrls: ['./stock-movement-list.component.css']
})
export class StockMovementListComponent implements OnInit {

    movements: StockMovement[] = [];
    loading = false;
    error = '';

    constructor(
        private movementService: StockMovementService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadMovements();
    }

    loadMovements(): void {
        this.loading = true;
        this.error = '';

        this.movementService.getAllMovements().subscribe({
            next: (data: StockMovement[]) => {
                this.movements = data;
                this.loading = false;
            },
            error: () => {
                this.error = 'Erreur lors du chargement des mouvements';
                this.loading = false;
            }
        });
    }

    // ✅ Méthode ajout
    onAdd(): void {
        this.router.navigate(['/stock-movements/add']);
    }

    // ✅ Méthode modification
    onEdit(id: number): void {
        if (!id) {
            this.error = "ID invalide";
            return;
        }

        this.router.navigate(['/stock-movements/edit', id]);
    }

    // ✅ Méthode suppression
    onDelete(id: number): void {
        if (confirm('Supprimer ce mouvement ?')) {
            this.movementService.deleteMovement(id).subscribe({
                next: () => {
                    this.movements = this.movements.filter(m => m.id !== id);
                },
                error: () => {
                    this.error = 'Erreur lors de la suppression';
                }
            });
        }
    }

    // ✅ Badge couleur
    getTypeClass(type: string): string {
        return type === 'ENTREE'
            ? 'badge bg-success'
            : 'badge bg-danger';
    }
}
