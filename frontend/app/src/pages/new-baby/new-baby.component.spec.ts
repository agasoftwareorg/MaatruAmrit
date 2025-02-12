import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBabyComponent } from './new-baby.component';

describe('NewBabyComponent', () => {
  let component: NewBabyComponent;
  let fixture: ComponentFixture<NewBabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBabyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
