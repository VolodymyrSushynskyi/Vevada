import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerHistoryPage } from './manufacturer-history-page';

describe('ManufacturerHistoryPage', () => {
  let component: ManufacturerHistoryPage;
  let fixture: ComponentFixture<ManufacturerHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufacturerHistoryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufacturerHistoryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
