import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandLogoWithText } from './brand-logo-with-text';

describe('BrandLogoWithText', () => {
  let component: BrandLogoWithText;
  let fixture: ComponentFixture<BrandLogoWithText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandLogoWithText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandLogoWithText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
