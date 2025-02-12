import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMotherComponent } from './new-mother.component';

describe('NewMotherComponent', () => {
  let component: NewMotherComponent;
  let fixture: ComponentFixture<NewMotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMotherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
