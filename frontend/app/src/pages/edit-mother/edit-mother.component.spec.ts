import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMotherComponent } from './edit-mother.component';

describe('EditMotherComponent', () => {
  let component: EditMotherComponent;
  let fixture: ComponentFixture<EditMotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMotherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
