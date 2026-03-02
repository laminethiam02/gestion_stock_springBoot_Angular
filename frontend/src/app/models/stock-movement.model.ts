export class StockMovement {
    id?: number;
    productId: number;
    productName?: string;
    type: 'ENTREE' | 'SORTIE';
    quantity: number;
    reason: string;
    movementDate?: Date;

    constructor(movement: Partial<StockMovement> = {}) {
        this.id = movement.id;
        this.productId = movement.productId || 0;
        this.productName = movement.productName;
        this.type = movement.type || 'ENTREE';
        this.quantity = movement.quantity || 0;
        this.reason = movement.reason || '';
        this.movementDate = movement.movementDate;
    }
}
