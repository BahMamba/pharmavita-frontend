import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagementFormComponent } from './admin-management-form.component';

describe('AdminManagementFormComponent', () => {
  let component: AdminManagementFormComponent;
  let fixture: ComponentFixture<AdminManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManagementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
