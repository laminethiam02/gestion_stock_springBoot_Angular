import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {User, UserService} from "../../../services/user.service";


@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
    user: User = {
        id: 0,
        username: '',
        email: '',
        fullName: '',
        phone: ''
    };

    loading = false;
    errorMessage = '';

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.loading = true;
        this.errorMessage = '';

        this.userService.createUser(this.user).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/users']);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error || 'Erreur lors de la création de l\'utilisateur';
                console.error('Error creating user:', error);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/users']);
    }
}

