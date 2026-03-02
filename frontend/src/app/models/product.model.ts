export class Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId?: number;
    categoryName?: string;
    supplierId?: number;
    supplierName?: string;

    constructor(product: Partial<Product> = {}) {
        this.id = product.id;
        this.name = product.name || '';
        this.description = product.description || '';
        this.price = product.price || 0;
        this.quantity = product.quantity || 0;
        this.categoryId = product.categoryId;
        this.categoryName = product.categoryName;
        this.supplierId = product.supplierId;
        this.supplierName = product.supplierName;
    }
}
