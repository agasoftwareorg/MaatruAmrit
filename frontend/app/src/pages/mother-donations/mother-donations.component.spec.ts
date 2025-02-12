import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherDonationsComponent } from './mother-donations.component';

describe('MotherDonationsComponent', () => {
  let component: MotherDonationsComponent;
  let fixture: ComponentFixture<MotherDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotherDonationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
