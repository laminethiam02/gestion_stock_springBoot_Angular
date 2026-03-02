import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {User, UserService} from "../../../services/user.service";


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
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
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadUser(parseInt(id));
        }
    }

    loadUser(id: number): void {
        this.loading = true;
        this.userService.getUserById(id).subscribe({
            next: (user) => {
                this.user = user;
                this.loading = false;
            },
            error: (error) => {
                this.errorMessage = 'Erreur lors du chargement de l\'utilisateur';
                this.loading = false;
                console.error('Error loading user:', error);
            }
        });
    }

    onSubmit(): void {
        if (!this.user.id) return;

        this.loading = true;
        this.errorMessage = '';

        this.userService.updateUser(this.user.id, this.user).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/users']);
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.error || 'Erreur lors de la modification de l\'utilisateur';
                console.error('Error updating user:', error);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/users']);
    }
}







