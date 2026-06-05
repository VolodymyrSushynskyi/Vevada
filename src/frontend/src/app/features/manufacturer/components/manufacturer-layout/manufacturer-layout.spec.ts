import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerLayout } from './manufacturer-layout';

describe('ManufacturerLayout', () => {
  let component: ManufacturerLayout;
  let fixture: ComponentFixture<ManufacturerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
