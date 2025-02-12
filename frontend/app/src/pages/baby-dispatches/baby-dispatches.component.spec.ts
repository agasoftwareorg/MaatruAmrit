import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyDispatchesComponent } from './baby-dispatches.component';

describe('BabyDispatchesComponent', () => {
  let component: BabyDispatchesComponent;
  let fixture: ComponentFixture<BabyDispatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabyDispatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabyDispatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
