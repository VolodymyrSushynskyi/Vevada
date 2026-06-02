import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusStepper } from './order-status-stepper';

describe('OrderStatusStepper', () => {
  let component: OrderStatusStepper;
  let fixture: ComponentFixture<OrderStatusStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
