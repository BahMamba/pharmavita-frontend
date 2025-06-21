import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, User } from '../../auth/services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pharmacist-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-management-form.component.html',
  styleUrls: ['./admin-management-form.component.css']
})
export class PharmacistFormComponent implements OnInit {
  pharmaForm: FormGroup;
  isEditMode = false;
  pharmacistId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar 
  ) {
    this.pharmaForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.pharmacistId = +id;
        this.loadPharmacistData(this.pharmacistId);
      }
    });
  }

  loadPharmacistData(id: number): void {
    this.adminService.getPharmacistById(id).subscribe({
      next: (pharmacist: User) => {
        this.pharmaForm.patchValue({
          firstname: pharmacist.firstname,
          lastname: pharmacist.lastname,
          email: pharmacist.email
        });
      },
      error: () => {
        this.snackBar.open('Échec du chargement des données du pharmacien', 'Fermer', { duration: 4000 });
      }
    });
  }

  onSubmit(): void {
    if (this.pharmaForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs correctement', 'Fermer', { duration: 4000 });
      return;
    }

    const user: Partial<User> = this.pharmaForm.value;
    const request = this.isEditMode && this.pharmacistId
      ? this.adminService.updatePharmacist(this.pharmacistId, user)
      : this.adminService.createPharmacist(user);

    request.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Pharmacien mis à jour' : 'Pharmacien ajouté';
        this.snackBar.open(message, 'Fermer', { duration: 4000 });
        setTimeout(() => this.router.navigate(['/admin/pharmacists']), 2000);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'opération', 'Fermer', { duration: 4000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/pharmacists']);
  }
}