import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCollectionsComponent } from './batch-collections.component';

describe('BatchCollectionsComponent', () => {
  let component: BatchCollectionsComponent;
  let fixture: ComponentFixture<BatchCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
