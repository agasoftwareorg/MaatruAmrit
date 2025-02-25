import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBabyComponent } from './view-baby.component';

describe('ViewBabyComponent', () => {
  let component: ViewBabyComponent;
  let fixture: ComponentFixture<ViewBabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBabyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
