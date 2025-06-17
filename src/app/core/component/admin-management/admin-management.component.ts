import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, User } from '../../auth/services/admin.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  pharmacists: User[] = [];
  errorMessage: string | null = null;
  isLoading = true;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'actions'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPharmacists();
  }

  loadPharmacists(): void {
    this.isLoading = true;
    this.adminService.getAllPharmacists().subscribe({
      next: (data: User[]) => {
        this.pharmacists = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Échec du chargement des pharmaciens';
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }

  deletePharmacist(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pharmacien ?')) {
      this.adminService.deletePharmacist(id).subscribe({
        next: () => {
          this.pharmacists = this.pharmacists.filter(p => p.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Échec de la suppression du pharmacien';
          console.error('Erreur:', error);
        }
      });
    }
  }
}