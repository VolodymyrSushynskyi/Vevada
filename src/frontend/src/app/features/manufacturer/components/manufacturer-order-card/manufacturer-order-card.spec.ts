import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerOrderCard } from './manufacturer-order-card';

describe('ManufacturerOrderCard', () => {
  let component: ManufacturerOrderCard;
  let fixture: ComponentFixture<ManufacturerOrderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerOrderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerOrderCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
