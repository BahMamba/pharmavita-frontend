import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListByPharmacistComponent } from './sale-list-by-pharmacist.component';

describe('SaleListByPharmacistComponent', () => {
  let component: SaleListByPharmacistComponent;
  let fixture: ComponentFixture<SaleListByPharmacistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleListByPharmacistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleListByPharmacistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
