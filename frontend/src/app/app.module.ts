import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants généraux
import { DashboardComponent } from './components/dashboard-component/dashboard.component';
import { SidebarComponent } from './components/sidebar-component/sidebar.component';
import {CategoryListComponent} from "./components/category/category-list/category-list.component";
import {CategoryAddComponent} from "./components/category/category-add/category-add.component";
import {CategoryEditComponent} from "./components/category/category-edit/category-edit.component";
import {SupplierListComponent} from "./components/supplier/supplier-list/supplier-list.component";
import {SupplierAddComponent} from "./components/supplier/supplier-add/supplier-add.component";
import {SupplierEditComponent} from "./components/supplier/supplier-edit/supplier-edit.component";
import {ProductListComponent} from "./components/product/product-list/product-list.component";
import {ProductAddComponent} from "./components/product/product-add/product-add.component";
import {ProductEditComponent} from "./components/product/product-edit/product-edit.component";
import {
    StockMovementListComponent
} from "./components/stock-movement/stock-movement-list/stock-movement-list.component";
import {StockMovementAddComponent} from "./components/stock-movement/stock-movement-add/stock-movement-add.component";
import {
    StockMovementEditComponent
} from "./components/stock-movement/stock-movement-edit/stock-movement-edit.component";
import {UserListComponent} from "./components/user/user-list/user-list.component";
import {UserAddComponent} from "./components/user/user-add/user-add.component";
import {UserEditComponent} from "./components/user/user-edit/user-edit.component";
import {LoginComponent} from "./components/login-component/login.component";
import {RegisterComponent} from "./components/register-component/register.component";
import {AuthInterceptor} from "./components/interceptors/auth.interceptors";

// Composants de gestion de stock


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        SidebarComponent,
        // Gestion de stock
        CategoryListComponent,
        CategoryAddComponent,
        CategoryEditComponent,
        SupplierListComponent,
        SupplierAddComponent,
        SupplierEditComponent,
        ProductListComponent,
        ProductAddComponent,
        ProductEditComponent,
        StockMovementListComponent,
        StockMovementAddComponent,
        StockMovementEditComponent,
        UserListComponent,
        UserAddComponent,
        UserEditComponent,



        LoginComponent,
        RegisterComponent

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
