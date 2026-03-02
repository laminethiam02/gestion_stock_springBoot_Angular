import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from "./components/dashboard-component/dashboard.component";



// Nouveaux composants de gestion de stock
import { CategoryListComponent } from "./components/category/category-list/category-list.component";
import { CategoryAddComponent } from "./components/category/category-add/category-add.component";
import { CategoryEditComponent } from "./components/category/category-edit/category-edit.component";
import { SupplierListComponent } from "./components/supplier/supplier-list/supplier-list.component";
import { SupplierAddComponent } from "./components/supplier/supplier-add/supplier-add.component";
import { SupplierEditComponent } from "./components/supplier/supplier-edit/supplier-edit.component";
import { ProductListComponent } from "./components/product/product-list/product-list.component";
import { ProductAddComponent } from "./components/product/product-add/product-add.component";
import { ProductEditComponent } from "./components/product/product-edit/product-edit.component";
import { StockMovementListComponent } from "./components/stock-movement/stock-movement-list/stock-movement-list.component";
import { StockMovementAddComponent } from "./components/stock-movement/stock-movement-add/stock-movement-add.component";
import {
    StockMovementEditComponent
} from "./components/stock-movement/stock-movement-edit/stock-movement-edit.component";
import {LoginComponent} from "./components/login-component/login.component";
import {RegisterComponent} from "./components/register-component/register.component";
import {UserListComponent} from "./components/user/user-list/user-list.component";
import {UserAddComponent} from "./components/user/user-add/user-add.component";
import {UserEditComponent} from "./components/user/user-edit/user-edit.component";
import {AuthGuard} from "./components/auth-guard/auth.gard";

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'users', component: UserListComponent },
    { path: 'users/add', component: UserAddComponent },
    { path: 'users/edit/:id', component: UserEditComponent },



    { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]  },



    // Gestion de stock
    { path: 'categories', component: CategoryListComponent },
    { path: 'categories/add', component: CategoryAddComponent },
    { path: 'categories/edit/:id', component: CategoryEditComponent },

    { path: 'suppliers', component: SupplierListComponent },
    { path: 'suppliers/add', component: SupplierAddComponent },
    { path: 'suppliers/edit/:id', component: SupplierEditComponent },

    { path: 'products', component: ProductListComponent },
    { path: 'products/add', component: ProductAddComponent },
    { path: 'products/edit/:id', component: ProductEditComponent },

    { path: 'stock-movements', component: StockMovementListComponent },
    { path: 'stock-movements/add', component: StockMovementAddComponent },
    {path: 'stock-movements/edit/:id', component: StockMovementEditComponent},
    // Si vous souhaitez une route d'édition (non recommandée)
    // { path: 'stock-movements/edit/:id', component: StockMovementEditComponent },


    // Default route
    { path: '**', redirectTo: '/login' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
