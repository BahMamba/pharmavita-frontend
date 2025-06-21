import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminFormComponent } from './product-admin-form.component';

describe('ProductAdminFormComponent', () => {
  let component: ProductAdminFormComponent;
  let fixture: ComponentFixture<ProductAdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAdminFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
