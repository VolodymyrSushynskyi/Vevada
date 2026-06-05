import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerOrders } from './manufacturer-orders';

describe('ManufacturerOrders', () => {
  let component: ManufacturerOrders;
  let fixture: ComponentFixture<ManufacturerOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
