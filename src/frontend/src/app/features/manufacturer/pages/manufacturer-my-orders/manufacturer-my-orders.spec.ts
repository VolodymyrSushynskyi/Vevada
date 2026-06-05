import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerMyOrders } from './manufacturer-my-orders';

describe('ManufacturerMyOrders', () => {
  let component: ManufacturerMyOrders;
  let fixture: ComponentFixture<ManufacturerMyOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerMyOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerMyOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
