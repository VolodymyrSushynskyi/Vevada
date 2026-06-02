import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalProductCard } from './horizontal-product-card';

describe('HorizontalProductCard', () => {
  let component: HorizontalProductCard;
  let fixture: ComponentFixture<HorizontalProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
