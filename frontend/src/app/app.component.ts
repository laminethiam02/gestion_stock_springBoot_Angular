import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Gestion stock';

    constructor(
        public authService: AuthService,
        private router: Router // Injectez Router
    ) {}

    logout(): void {
        this.authService.logout();
        // Ajoutez la redirection vers la page login
        this.router.navigate(['/login']);
    }

    get userName(): string {
        const user = this.authService.getCurrentUser();
        return user?.fullName || user?.username || 'Utilisateur';
    }
}
