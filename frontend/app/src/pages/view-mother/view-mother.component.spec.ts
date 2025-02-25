import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMotherComponent } from './view-mother.component';

describe('ViewMotherComponent', () => {
  let component: ViewMotherComponent;
  let fixture: ComponentFixture<ViewMotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMotherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
