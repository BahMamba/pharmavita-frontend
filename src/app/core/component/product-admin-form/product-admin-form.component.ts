import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../../core/auth/services/products.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-admin-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-admin-form.component.html',
  styleUrls: ['./product-admin-form.component.css']
})
export class ProductAdminFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  isLoading: boolean = false;
  categories: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      manufacturingDate: ['', Validators.required],
      expirationDate: ['', Validators.required]
    }, { validators: this.dateValidator });
  }

  dateValidator(form: FormGroup) {
    const manufacturing = form.get('manufacturingDate')?.value;
    const expiration = form.get('expirationDate')?.value;
    if (manufacturing && expiration && new Date(manufacturing) >= new Date(expiration)) {
      return { invalidDates: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });
    this.loadCategories();
  }

  loadProductData(id: number): void {
    this.isLoading = true;
    this.service.getProduct(id).subscribe({
      next: (prod) => {
        this.productForm.patchValue({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          category: prod.category,
          manufacturingDate: prod.manufacturingDate,
          expirationDate: prod.expirationDate
        });
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement du produit', 'Fermer', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.service.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (!this.isEditMode && categories.length > 0) {
          this.productForm.patchValue({ category: categories[0] });
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des catégories', 'Fermer', { duration: 4000 });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire', 'Fermer', { duration: 4000 });
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const productData = this.productForm.value;
    const request = this.isEditMode && this.productId
      ? this.service.updateProduct(this.productId, productData)
      : this.service.addProduct(productData);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode ? 'Produit mis à jour' : 'Produit ajouté', 'Fermer', { duration: 4000 });
        this.router.navigate(['/admin/products/stock-list']);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'opération', 'Fermer', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products/stock-list']);
  }
}