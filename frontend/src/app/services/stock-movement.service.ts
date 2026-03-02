import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StockMovement} from "../models/stock-movement.model";


@Injectable({ providedIn: 'root' })
export class StockMovementService {
    private apiUrl = 'http://localhost:8080/api/stock-movements';

    constructor(private http: HttpClient) {}

    getAllMovements(): Observable<StockMovement[]> {
        return this.http.get<StockMovement[]>(this.apiUrl);
    }

    getMovementById(id: number): Observable<StockMovement> {
        return this.http.get<StockMovement>(`${this.apiUrl}/${id}`);
    }

    getMovementsByProduct(productId: number): Observable<StockMovement[]> {
        return this.http.get<StockMovement[]>(`${this.apiUrl}/by-product/${productId}`);
    }

    createMovement(movement: StockMovement): Observable<StockMovement> {
        return this.http.post<StockMovement>(this.apiUrl, movement);
    }

    updateMovement(id: number, movement: StockMovement): Observable<StockMovement> {
        return this.http.put<StockMovement>(`${this.apiUrl}/${id}`, movement);
    }

    deleteMovement(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
