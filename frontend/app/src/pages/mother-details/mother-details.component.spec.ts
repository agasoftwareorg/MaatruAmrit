import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherDetailsComponent } from './mother-details.component';

describe('MotherDetailsComponent', () => {
  let component: MotherDetailsComponent;
  let fixture: ComponentFixture<MotherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotherDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
