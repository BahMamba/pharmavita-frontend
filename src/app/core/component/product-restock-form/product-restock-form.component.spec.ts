import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRestockFormComponent } from './product-restock-form.component';

describe('ProductRestockFormComponent', () => {
  let component: ProductRestockFormComponent;
  let fixture: ComponentFixture<ProductRestockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRestockFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRestockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
