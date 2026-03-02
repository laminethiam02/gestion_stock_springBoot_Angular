import { Component, OnInit } from '@angular/core';
import { User, UserService } from "../../../services/user.service";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    loading = false;
    errorMessage = '';
    searchTerm = '';

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.filteredUsers = users;
                this.loading = false;
            },
            error: (error) => {
                this.errorMessage = 'Erreur lors du chargement des utilisateurs';
                this.loading = false;
                console.error('Error loading users:', error);
            }
        });
    }

    deleteUser(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    this.users = this.users.filter(user => user.id !== id);
                    this.filteredUsers = this.filteredUsers.filter(user => user.id !== id);
                },
                error: (error) => {
                    this.errorMessage = 'Erreur lors de la suppression';
                    console.error('Error deleting user:', error);
                }
            });
        }
    }

    onSearch(): void {
        const term = this.searchTerm.toLowerCase().trim();
        if (!term) {
            this.filteredUsers = this.users;
            return;
        }
        this.filteredUsers = this.users.filter(user =>
            user.username?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.fullName?.toLowerCase().includes(term) ||
            user.phone?.toLowerCase().includes(term)
        );
    }
}
