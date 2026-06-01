import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGrid } from './catalog-grid';

describe('CatalogGrid', () => {
  let component: CatalogGrid;
  let fixture: ComponentFixture<CatalogGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
