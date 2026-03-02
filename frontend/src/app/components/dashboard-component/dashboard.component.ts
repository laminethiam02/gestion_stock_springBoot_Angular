import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Services de gestion de stock


// Modèles (pour typer les exports)


// Chart.js
import Chart from 'chart.js/auto';
import {StockMovement} from "../../models/stock-movement.model";
import {CategoryService} from "../../services/category.service";
import {SupplierService} from "../../services/supplier.service";
import {ProductService} from "../../services/product.service";
import {StockMovementService} from "../../services/stock-movement.service";
import {Category} from "../../models/category.model";
import {Supplier} from "../../models/supplier.model";
import {Product} from "../../models/product.model";

interface DashboardStats {
    categories: number;
    suppliers: number;
    products: number;
    totalStockValue: number;      // Somme (quantité * prix) de tous les produits
    totalMovements: number;
    entryMovements: number;
    exitMovements: number;
    lowStockProducts: number;     // Produits avec quantité <= seuil (par ex. 5)
    outOfStockProducts: number;   // Produits avec quantité = 0
}

interface ExportData {
    categories: Category[];
    suppliers: Supplier[];
    products: Product[];
    movements: StockMovement[];
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('pieChart') pieChartRef!: ElementRef;
    @ViewChild('barChart') barChartRef!: ElementRef;
    @ViewChild('lineChart') lineChartRef!: ElementRef;
    @ViewChild('doughnutChart') doughnutChartRef!: ElementRef;

    stats: DashboardStats = {
        categories: 0,
        suppliers: 0,
        products: 0,
        totalStockValue: 0,
        totalMovements: 0,
        entryMovements: 0,
        exitMovements: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
    };

    exportData: ExportData = {
        categories: [],
        suppliers: [],
        products: [],
        movements: []
    };

    recentMovements: StockMovement[] = []; // Pour affichage dans un tableau

    // Instances des graphiques
    private pieChart!: Chart;
    private barChart!: Chart;
    private lineChart!: Chart;
    private doughnutChart!: Chart;

    loading = true;
    exportLoading = false;
    error = '';
    private subscriptions = new Subscription();

    // Données pour les graphiques (initialisées à vide)
    chartData = {
        pie: {
            labels: ['Produits en stock', 'Produits épuisés', 'Produits faible stock'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                hoverBackgroundColor: ['#28a745', '#dc3545', '#ffc107']
            }]
        },
        bar: {
            labels: ['Catégories', 'Fournisseurs', 'Produits', 'Mouvements'],
            datasets: [{
                label: 'Nombre',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        line: {
            labels: ['Entrées', 'Sorties', 'Solde'],
            datasets: [{
                label: 'Volume',
                data: [0, 0, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                tension: 0.4
            }]
        },
        doughnut: {
            labels: ['Valeur du stock (FCFA)', 'Mouvements (nb)'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#4BC0C0', '#9966FF']
            }]
        }
    };

    constructor(
        private categoryService: CategoryService,
        private supplierService: SupplierService,
        private productService: ProductService,
        private movementService: StockMovementService
    ) {}

    ngOnInit(): void {
        this.loadStats();
    }

    ngAfterViewInit(): void {
        // Les graphiques seront initialisés après le chargement des données
    }

    loadStats(): void {
        this.loading = true;
        this.error = '';

        const requests = {
            categories: this.categoryService.getAllCategories(),
            suppliers: this.supplierService.getAllSuppliers(),
            products: this.productService.getAllProducts(),
            movements: this.movementService.getAllMovements()
        };

        const subscription = forkJoin(requests)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (results) => {
                    // Stocker les données pour l'export et les affichages
                    this.exportData = results;
                    this.recentMovements = results.movements.slice(0, 5); // 5 derniers

                    // Calculer les statistiques
                    this.stats.categories = results.categories.length;
                    this.stats.suppliers = results.suppliers.length;
                    this.stats.products = results.products.length;
                    this.stats.totalMovements = results.movements.length;

                    // Calcul des entrées/sorties
                    this.stats.entryMovements = results.movements.filter(m => m.type === 'ENTREE').length;
                    this.stats.exitMovements = results.movements.filter(m => m.type === 'SORTIE').length;

                    // Calcul de la valeur totale du stock
                    this.stats.totalStockValue = results.products.reduce((total, p) => {
                        return total + (p.quantity * p.price);
                    }, 0);

                    // Produits en rupture / faible stock
                    const lowStockThreshold = 5;
                    this.stats.outOfStockProducts = results.products.filter(p => p.quantity === 0).length;
                    this.stats.lowStockProducts = results.products.filter(p => p.quantity > 0 && p.quantity <= lowStockThreshold).length;

                    // Mettre à jour les graphiques
                    this.updateChartsData();
                    this.initCharts();
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des statistiques:', error);
                    this.error = 'Impossible de charger les données du tableau de bord';
                }
            });

        this.subscriptions.add(subscription);
    }

    private updateChartsData(): void {
        // Graphique circulaire - état des stocks
        const inStock = this.stats.products - this.stats.lowStockProducts - this.stats.outOfStockProducts;
        this.chartData.pie.datasets[0].data = [
            inStock,
            this.stats.outOfStockProducts,
            this.stats.lowStockProducts
        ];

        // Graphique en barres - compteurs principaux
        this.chartData.bar.datasets[0].data = [
            this.stats.categories,
            this.stats.suppliers,
            this.stats.products,
            this.stats.totalMovements
        ];

        // Graphique en ligne - volume entrées/sorties/solde
        const totalEntries = this.exportData.movements
            .filter(m => m.type === 'ENTREE')
            .reduce((sum, m) => sum + m.quantity, 0);
        const totalExits = this.exportData.movements
            .filter(m => m.type === 'SORTIE')
            .reduce((sum, m) => sum + m.quantity, 0);
        const balance = totalEntries - totalExits;
        this.chartData.line.datasets[0].data = [totalEntries, totalExits, balance];

        // Graphique doughnut - proportion valeur stock / nombre mouvements
        this.chartData.doughnut.datasets[0].data = [
            this.stats.totalStockValue,
            this.stats.totalMovements
        ];
    }

    private initCharts(): void {
        this.destroyCharts();

        if (this.pieChartRef) {
            this.pieChart = new Chart(this.pieChartRef.nativeElement, {
                type: 'pie',
                data: this.chartData.pie,
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'État des stocks' }
                    }
                }
            });
        }

        if (this.barChartRef) {
            this.barChart = new Chart(this.barChartRef.nativeElement, {
                type: 'bar',
                data: this.chartData.bar,
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { display: true },
                        title: { display: true, text: 'Vue d\'ensemble' }
                    }
                }
            });
        }

        if (this.lineChartRef) {
            this.lineChart = new Chart(this.lineChartRef.nativeElement, {
                type: 'line',
                data: this.chartData.line,
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: {
                        legend: { display: true },
                        title: { display: true, text: 'Flux des mouvements' }
                    }
                }
            });
        }

        if (this.doughnutChartRef) {
            this.doughnutChart = new Chart(this.doughnutChartRef.nativeElement, {
                type: 'doughnut',
                data: this.chartData.doughnut,
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Valeur stock vs Mouvements' }
                    }
                }
            });
        }
    }

    private destroyCharts(): void {
        [this.pieChart, this.barChart, this.lineChart, this.doughnutChart].forEach(chart => {
            if (chart) chart.destroy();
        });
    }

    refreshCharts(): void {
        this.updateChartsData();
        this.initCharts();
    }

    // Méthodes d'export CSV
    exportToCSV(): void {
        this.exportLoading = true;

        try {
            const summaryCSV = this.generateSummaryCSV();
            this.downloadCSV(summaryCSV, `resume_stock_${new Date().getTime()}.csv`);

            setTimeout(() => {
                this.exportDetailedData();
            }, 1000);

        } catch (error) {
            console.error('Erreur lors de l\'exportation:', error);
            this.error = 'Erreur lors de l\'exportation des données';
            this.exportLoading = false;
        }
    }

    private generateSummaryCSV(): string {
        const dateExport = new Date().toLocaleString('fr-FR');

        const csvData = [
            ['TABLEAU DE BORD GESTION DE STOCK - RAPPORT'],
            ['Date d\'exportation', dateExport],
            [''],
            ['STATISTIQUES PRINCIPALES'],
            ['Catégories', this.stats.categories],
            ['Fournisseurs', this.stats.suppliers],
            ['Produits', this.stats.products],
            ['Valeur totale du stock (FCFA)', this.formatCurrencyForExport(this.stats.totalStockValue)],
            ['Total mouvements', this.stats.totalMovements],
            ['Mouvements d\'entrée', this.stats.entryMovements],
            ['Mouvements de sortie', this.stats.exitMovements],
            ['Produits en rupture', this.stats.outOfStockProducts],
            ['Produits faible stock (<5)', this.stats.lowStockProducts],
            [''],
            ['INDICATEURS DE PERFORMANCE'],
            ['Taux de rotation', ((this.stats.totalMovements / (this.stats.products || 1)) * 100).toFixed(1) + '%'],
            ['Valeur moyenne par produit', this.formatCurrencyForExport(this.stats.totalStockValue / (this.stats.products || 1))],
        ];

        return this.convertToCSV(csvData);
    }

    private exportDetailedData(): void {
        const exports = [
            { data: this.exportData.categories, name: 'categories' },
            { data: this.exportData.suppliers, name: 'fournisseurs' },
            { data: this.exportData.products, name: 'produits' },
            { data: this.exportData.movements, name: 'mouvements' }
        ];

        exports.forEach((item, index) => {
            if (item.data && item.data.length > 0) {
                setTimeout(() => {
                    const csv = this.convertJSONToCSV(item.data);
                    this.downloadCSV(csv, `stock_${item.name}_${new Date().getTime()}.csv`);

                    if (index === exports.length - 1) {
                        this.exportLoading = false;
                    }
                }, index * 500);
            }
        });

        if (exports.every(item => !item.data || item.data.length === 0)) {
            this.exportLoading = false;
        }
    }

    private convertToCSV(data: any[][]): string {
        return data.map(row =>
            row.map(cell => {
                if (cell === null || cell === undefined) return '';
                const stringCell = String(cell);
                if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                    return `"${stringCell.replace(/"/g, '""')}"`;
                }
                return stringCell;
            }).join(',')
        ).join('\n');
    }

    private convertJSONToCSV(data: any[]): string {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.map(header =>
            header.includes(',') ? `"${header}"` : header
        );

        const csvRows = data.map(row =>
            headers.map(header => {
                const cell = row[header];
                if (cell === null || cell === undefined) return '';
                const stringCell = String(cell);
                if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                    return `"${stringCell.replace(/"/g, '""')}"`;
                }
                return stringCell;
            }).join(',')
        );

        return [csvHeaders.join(','), ...csvRows].join('\n');
    }

    private downloadCSV(csvContent: string, filename: string): void {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    exportSummary(): void {
        this.exportLoading = true;

        try {
            const summaryData = [
                ['RAPPORT GESTION DE STOCK'],
                [''],
                ['Statistiques Générales', 'Valeur'],
                ['Catégories', this.stats.categories],
                ['Fournisseurs', this.stats.suppliers],
                ['Produits', this.stats.products],
                ['Valeur totale stock (FCFA)', this.formatCurrencyForExport(this.stats.totalStockValue)],
                ['Mouvements totaux', this.stats.totalMovements],
                ['Entrées', this.stats.entryMovements],
                ['Sorties', this.stats.exitMovements],
                ['Produits en rupture', this.stats.outOfStockProducts],
                ['Produits faible stock', this.stats.lowStockProducts],
                [''],
                ['Date d\'exportation', new Date().toLocaleString('fr-FR')]
            ];

            const csvContent = this.convertToCSV(summaryData);
            this.downloadCSV(csvContent, `resume_stock_${new Date().getTime()}.csv`);

        } catch (error) {
            console.error('Erreur lors de l\'export du résumé:', error);
            this.error = 'Erreur lors de l\'exportation du résumé';
        } finally {
            this.exportLoading = false;
        }
    }

    exportCommercialData(): void {
        // Pour la gestion de stock, on peut exporter les mouvements détaillés
        if (!this.exportData.movements || this.exportData.movements.length === 0) {
            this.error = 'Aucun mouvement à exporter';
            return;
        }

        this.exportLoading = true;

        try {
            const movementData = this.exportData.movements.map(m => ({
                'ID': m.id,
                'Produit': m.productName || m.productId,
                'Type': m.type,
                'Quantité': m.quantity,
                'Motif': m.reason || '',
                'Date': m.movementDate ? new Date(m.movementDate).toLocaleString('fr-FR') : ''
            }));

            const csvContent = this.convertJSONToCSV(movementData);
            this.downloadCSV(csvContent, `mouvements_stock_${new Date().getTime()}.csv`);

        } catch (error) {
            console.error('Erreur lors de l\'export des mouvements:', error);
            this.error = 'Erreur lors de l\'exportation des mouvements';
        } finally {
            this.exportLoading = false;
        }
    }

    ngOnDestroy(): void {
        this.destroyCharts();
        this.subscriptions.unsubscribe();
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(amount);
    }

    private formatCurrencyForExport(amount: number): string {
        return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
    }

    get totalStockValueFormatted(): string {
        return this.formatCurrency(this.stats.totalStockValue);
    }

    // Indicateurs de performance calculés
    get performanceIndicators() {
        return {
            rotationTaux: ((this.stats.totalMovements / (this.stats.products || 1)) * 100).toFixed(1),
            avgProductValue: this.formatCurrency(this.stats.totalStockValue / (this.stats.products || 1)),
            stockSaturation: ((this.stats.products - this.stats.outOfStockProducts) / (this.stats.products || 1) * 100).toFixed(1)
        };
    }
}
