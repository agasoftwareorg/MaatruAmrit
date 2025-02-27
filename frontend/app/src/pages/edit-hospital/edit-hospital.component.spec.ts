import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHospitalComponent } from './edit-hospital.component';

describe('EditHospitalComponent', () => {
  let component: EditHospitalComponent;
  let fixture: ComponentFixture<EditHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
