import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    userData = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: '',
        phone: ''
    };

    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSubmit(): void {
        // Validation basique
        if (!this.userData.username || !this.userData.password || !this.userData.email) {
            this.errorMessage = 'Veuillez remplir les champs obligatoires';
            return;
        }

        if (this.userData.password !== this.userData.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas';
            return;
        }

        if (this.userData.password.length < 6) {
            this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.register(this.userData).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.successMessage = 'Inscription réussie ! Redirection...';
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                } else {
                    this.errorMessage = response.message;
                }
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = 'Erreur lors de l\'inscription';
            }
        });
    }
}




