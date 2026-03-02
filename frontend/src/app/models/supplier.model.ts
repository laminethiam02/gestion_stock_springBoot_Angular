export class Supplier {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;

    constructor(supplier: Partial<Supplier> = {}) {
        this.id = supplier.id;
        this.name = supplier.name || '';
        this.email = supplier.email || '';
        this.phone = supplier.phone || '';
        this.address = supplier.address || '';
    }
}
