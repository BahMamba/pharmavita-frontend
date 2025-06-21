import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductsService } from '../../auth/services/products.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-product-restock-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-restock-form.component.html',
  styleUrl: './product-restock-form.component.css'
})
export class ProductRestockFormComponent {
  restockForm: FormGroup;
  product: Product | null = null;
  isLoading = false;
  productId: number;
  currentDate = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui
  reasonOptions = [
    { value: 'Réapprovisionnement', label: 'Réapprovisionnement' },
    { value: 'Retour', label: 'Retour' },
    { value: 'Ajustement', label: 'Ajustement' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.restockForm = this.fb.group({
      stockChange: [1, [Validators.required, Validators.min(1)]],
      reason: ['Réapprovisionnement', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.service.getProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement du produit', 'Fermer', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.restockForm.invalid) {
      this.snackBar.open('Veuillez corriger les erreurs', 'Fermer', { duration: 4000 });
      this.restockForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const request = this.restockForm.value;
    this.service.updateStock(this.productId, request).subscribe({
      next: () => {
        this.snackBar.open('Stock mis à jour', 'Fermer', { duration: 4000 });
        this.router.navigate(['/admin/products/stock-list']);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products/stock-list']);
  }

}
