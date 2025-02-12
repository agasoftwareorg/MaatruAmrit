import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBabyComponent } from './edit-baby.component';

describe('EditBabyComponent', () => {
  let component: EditBabyComponent;
  let fixture: ComponentFixture<EditBabyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBabyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBabyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
