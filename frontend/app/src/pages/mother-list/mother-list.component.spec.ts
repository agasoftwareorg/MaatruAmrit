import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherListComponent } from './mother-list.component';

describe('MotherListComponent', () => {
  let component: MotherListComponent;
  let fixture: ComponentFixture<MotherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotherListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
