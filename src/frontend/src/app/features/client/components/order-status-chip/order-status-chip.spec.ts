import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusChip } from './order-status-chip';

describe('OrderStatusChip', () => {
  let component: OrderStatusChip;
  let fixture: ComponentFixture<OrderStatusChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusChip],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
