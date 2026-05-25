import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagerLayout } from './product-manager-layout';

describe('ProductManagerLayout', () => {
  let component: ProductManagerLayout;
  let fixture: ComponentFixture<ProductManagerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagerLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
